import { NextRequest, NextResponse } from 'next/server';

function extractSearchId(url: string): string {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

function extractLeague(url: string): string {
  const parts = url.split('/').filter(Boolean);
  const poe2Index = parts.findIndex((part) => part === 'poe2');

  if (poe2Index === -1) {
    return 'Standard';
  }

  return decodeURIComponent(parts[poe2Index + 1] ?? 'Standard');
}

async function parseResponse(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getItemName(item: any) {
  return item?.item?.name || item?.item?.typeLine || null;
}

function getPriceAmount(item: any) {
  return item?.listing?.price?.amount ?? null;
}

function getPriceCurrency(item: any) {
  return item?.listing?.price?.currency ?? null;
}

function getSellerName(item: any) {
  return item?.listing?.account?.name ?? null;
}

function getListingId(item: any) {
  return item?.listing?.id || null;
}

function getItemId(item: any) {
  return item?.item?.id || null;
}

function getResultId(item: any, index: number, resultIds: string[]) {
  return item?.id || resultIds[index] || getListingId(item) || getItemId(item) || null;
}

export async function GET(request: NextRequest) {
  try {
    const tradeUrl = request.nextUrl.searchParams.get('url');

    if (!tradeUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: '공식 거래소 URL이 필요합니다.',
        },
        { status: 400 },
      );
    }

    const originalSearchId = extractSearchId(tradeUrl);
    const league = extractLeague(tradeUrl);

    const importUrl = `https://poe.game.daum.net/api/trade2/search/poe2/${encodeURIComponent(
      league,
    )}/${originalSearchId}`;

    const importResponse = await fetch(importUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'user-agent': 'Mozilla/5.0',
      },
      cache: 'no-store',
    });

    const importBody = await parseResponse(importResponse);
    const importedQuery = (importBody as any)?.query;

    if (!importedQuery) {
      return NextResponse.json(
        {
          ok: false,
          message: '검색조건 JSON을 가져오지 못했습니다.',
          importStatus: importResponse.status,
          importBody,
        },
        { status: 400 },
      );
    }

    const searchUrl = `https://poe.game.daum.net/api/trade2/search/poe2/${encodeURIComponent(
      league,
    )}`;

    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0',
      },
      body: JSON.stringify({
        query: importedQuery,
        sort: {
          price: 'asc',
        },
      }),
      cache: 'no-store',
    });

    const searchBody = await parseResponse(searchResponse);

    const resultIds = Array.isArray((searchBody as any)?.result)
      ? (searchBody as any).result.slice(0, 10)
      : [];

    let fetchBody: unknown = null;
    let fetchStatus: number | null = null;

    if (resultIds.length > 0 && (searchBody as any)?.id) {
      const fetchUrl = `https://poe.game.daum.net/api/trade2/fetch/${resultIds.join(
        ',',
      )}?query=${(searchBody as any).id}`;

      const fetchResponse = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'user-agent': 'Mozilla/5.0',
        },
        cache: 'no-store',
      });

      fetchStatus = fetchResponse.status;
      fetchBody = await parseResponse(fetchResponse);
    }

    const fetchResult = (fetchBody as any)?.result;

    const prices = Array.isArray(fetchResult)
      ? fetchResult.map((item: any, index: number) => {
          const resultId = getResultId(item, index, resultIds);
          const listingId = getListingId(item);
          const itemId = getItemId(item);

          return {
            id: resultId,
            resultId,
            listingId,
            itemId,
            itemName: getItemName(item),
            amount: getPriceAmount(item),
            currency: getPriceCurrency(item),
            indexed: item?.listing?.indexed ?? null,
            seller: getSellerName(item),
          };
        })
      : [];

    return NextResponse.json({
      ok: true,
      tradeUrl,
      league,
      originalSearchId,
      searchId: (searchBody as any)?.id ?? null,
      total: (searchBody as any)?.total ?? null,
      resultCount: resultIds.length,
      resultIds,
      fetchStatus,
      prices,
      query: importedQuery,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: '검색조건 감시 조회 중 오류 발생',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}