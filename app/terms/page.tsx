import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#05070c] text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-6">
        <Link
          href="/"
          className="inline-flex w-fit rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-black text-slate-200 transition hover:border-emerald-400/40 hover:bg-slate-800"
        >
          ← 메인으로 가기
        </Link>

        <header className="rounded-[2rem] border border-amber-500/20 bg-slate-950/90 p-6 shadow-2xl shadow-black/40">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">
            Terms of Service
          </p>

          <h1 className="mt-3 text-3xl font-black text-amber-100 md:text-4xl">
            이용약관
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            본 약관은 POE2 SEARCH RADAR 서비스 이용과 관련된 기본 조건과
            유의사항을 설명합니다.
          </p>
        </header>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            서비스 목적
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              POE2 SEARCH RADAR는 사용자가 Path of Exile 2 공식 거래소에서
              생성한 검색 URL을 등록하고, 해당 검색조건의 신규 매물과 최저가
              변화를 확인할 수 있도록 돕는 거래소 검색조건 감시 도구입니다.
            </p>

            <p>
              본 서비스는 투자, 거래, 구매, 판매를 직접 권유하거나 보장하지
              않습니다. 사용자는 서비스에서 제공되는 정보를 참고용으로만
              활용해야 합니다.
            </p>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            서비스 이용 조건
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              사용자는 공식 거래소 검색 URL을 직접 등록할 수 있으며, 등록된
              감시조건은 현재 브라우저에 저장됩니다.
            </p>

            <p>
              현재 버전에서는 최대 4개의 감시 슬롯을 제공하며, 하루 신규 등록은
              2개까지 가능합니다. 기능 제한은 서비스 운영 상황에 따라 변경될 수
              있습니다.
            </p>

            <p>
              서비스는 PC 크롬 브라우저 환경을 우선 기준으로 설계되었습니다.
              모바일 브라우저나 일부 환경에서는 알림, 자동 감시, 데이터 저장
              동작이 제한될 수 있습니다.
            </p>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            알림 및 감시 기능
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              브라우저 알림은 사용자가 알림 권한을 허용한 경우에만 작동합니다.
              알림은 웹이 실행 중인 상태에서 더 안정적으로 작동합니다.
            </p>

            <p>
              신규 매물 또는 최저가 하락이 감지될 경우 알림이 발생할 수
              있습니다. 가격 상승, 가격 동일, 조회 실패 상황에서는 알림이
              발생하지 않을 수 있습니다.
            </p>

            <p>
              거래소 응답 지연, 네트워크 문제, 브라우저 제한, 공식 거래소 정책
              변경 등에 따라 감시 결과가 지연되거나 실패할 수 있습니다.
            </p>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            책임 제한
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              POE2 SEARCH RADAR는 공식 거래소 검색 결과를 더 쉽게 확인하기 위한
              보조 도구입니다. 표시되는 가격, 매물, 검색 결과는 거래소 상태와
              외부 데이터 응답에 따라 달라질 수 있습니다.
            </p>

            <p>
              사용자가 본 서비스를 참고하여 진행한 게임 내 거래, 구매, 판매,
              가격 판단, 기타 의사결정에 대한 최종 책임은 사용자 본인에게
              있습니다.
            </p>

            <p>
              본 사이트는 Path of Exile 2의 공식 서비스가 아니며, 게임 운영사
              또는 공식 거래소 운영 주체와 직접적인 제휴 관계를 의미하지
              않습니다.
            </p>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            약관 변경
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              서비스 기능, 운영 방식, 광고 적용 여부 등에 따라 본 약관은 변경될
              수 있습니다. 변경 사항은 본 페이지를 통해 안내됩니다.
            </p>

            <p>
              시행일: 2026년 5월 23일
            </p>
          </div>
        </section>

        <footer className="flex flex-wrap gap-3 rounded-[1.4rem] border border-slate-800 bg-slate-950/70 p-4 text-sm font-bold text-slate-400">
          <Link href="/" className="hover:text-emerald-300">
            메인
          </Link>
          <Link href="/guide" className="hover:text-emerald-300">
            사용법
          </Link>
          <Link href="/privacy" className="hover:text-emerald-300">
            개인정보처리방침
          </Link>
          <Link href="/contact" className="hover:text-emerald-300">
            문의
          </Link>
        </footer>
      </div>
    </main>
  );
}