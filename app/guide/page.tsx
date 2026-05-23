import Link from 'next/link';

export default function GuidePage() {
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
            Guide
          </p>

          <h1 className="mt-3 text-3xl font-black text-amber-100 md:text-4xl">
            POE2 SEARCH RADAR 사용법
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            POE2 SEARCH RADAR는 Path of Exile 2 공식 거래소에서 만든 검색
            URL을 등록하고, 해당 검색조건의 신규 매물과 최저가 변화를 확인하는
            거래소 감시 도구입니다.
          </p>
        </header>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            기본 사용 순서
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">
                Step 01
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                공식 거래소에서 검색조건 만들기
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                Path of Exile 2 공식 거래소에서 원하는 아이템, 옵션, 가격,
                리그 조건을 설정한 뒤 검색 결과 페이지 URL을 복사합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">
                Step 02
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                검색조건 등록
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                메인 화면의 검색조건 등록 버튼을 누른 뒤 복사한 공식 거래소
                URL을 붙여넣습니다. 등록된 조건은 현재 브라우저에 저장됩니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-300">
                Step 03
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                감시 슬롯 확인
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                등록된 검색조건은 내 감시 슬롯에 표시됩니다. 현재 버전에서는
                최대 4개까지 등록할 수 있으며, 하루 신규 등록은 2개까지
                가능합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-300">
                Step 04
              </p>

              <h3 className="mt-3 text-lg font-black text-white">
                신규 매물과 최저가 변화 확인
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-400">
                웹이 실행 중인 동안 검색조건을 주기적으로 다시 확인합니다.
                신규 매물 또는 최저가 하락이 감지되면 브라우저 알림을 받을 수
                있습니다.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            알림 사용 전 확인할 점
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              브라우저 알림을 받으려면 알림 설정 페이지에서 알림 권한을
              허용해야 합니다.
            </p>

            <p>
              현재 버전은 웹이 실행 중인 상태에서 안정적으로 작동하는 구조입니다.
              PC 크롬 환경을 우선 기준으로 하며, 모바일 환경에서는 브라우저와
              운영체제 정책에 따라 알림 동작이 제한될 수 있습니다.
            </p>

            <p>
              가격 상승, 가격 동일, 조회 실패 상황에서는 알림을 보내지 않습니다.
              신규 매물 또는 최저가 하락이 감지될 때만 알림 대상이 됩니다.
            </p>
          </div>
        </section>

        <footer className="flex flex-wrap gap-3 rounded-[1.4rem] border border-slate-800 bg-slate-950/70 p-4 text-sm font-bold text-slate-400">
          <Link href="/" className="hover:text-emerald-300">
            메인
          </Link>
          <Link href="/privacy" className="hover:text-emerald-300">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-emerald-300">
            이용약관
          </Link>
          <Link href="/contact" className="hover:text-emerald-300">
            문의
          </Link>
        </footer>
      </div>
    </main>
  );
}