import { NextResponse } from 'next/server';

const TRADE_URL =
  'https://poe.game.daum.net/trade2/search/poe2/Fate%20of%20the%20Vaal/Z6JEzMk7tQ';

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

export async function GET() {
  try {
    const originalSearchId = extractSearchId(TRADE_URL);
    const league = extractLeague(TRADE_URL);

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
      return NextResponse.json({
        ok: false,
        step: 'import-query',
        message: '검색조건 JSON을 가져오지 못했습니다.',
        importStatus: importResponse.status,
        importBody,
      });
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
    let fetchUrl: string | null = null;

    if (resultIds.length > 0 && (searchBody as any)?.id) {
      fetchUrl = `https://poe.game.daum.net/api/trade2/fetch/${resultIds.join(
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
      ? fetchResult.map((item: any) => {
          return {
            itemName: item?.item?.name || item?.item?.typeLine || null,
            amount: item?.listing?.price?.amount ?? null,
            currency: item?.listing?.price?.currency ?? null,
            indexed: item?.listing?.indexed ?? null,
            seller: item?.listing?.account?.name ?? null,
          };
        })
      : [];

    return NextResponse.json({
      ok: true,
      tradeUrl: TRADE_URL,
      league,
      originalSearchId,
      import: {
        status: importResponse.status,
        url: importUrl,
        query: importedQuery,
      },
      search: {
        status: searchResponse.status,
        url: searchUrl,
        newSearchId: (searchBody as any)?.id ?? null,
        total: (searchBody as any)?.total ?? null,
        resultCount: resultIds.length,
        firstResultIds: resultIds,
      },
      fetch: {
        status: fetchStatus,
        url: fetchUrl,
      },
      prices,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: 'JSON 재검색 테스트 중 오류 발생',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}