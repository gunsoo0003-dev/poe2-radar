import Link from 'next/link';

const GOOGLE_FORM_URL = 'https://forms.gle/vmRvGwQxgqFa9t9HA';

export default function ContactPage() {
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
            Contact
          </p>

          <h1 className="mt-3 text-3xl font-black text-amber-100 md:text-4xl">
            문의 및 개선 요청
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            POE2 SEARCH RADAR 사용 중 오류, 개선 요청, 기능 제안이 있다면
            구글폼을 통해 전달할 수 있습니다.
          </p>
        </header>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            문의 방법
          </h2>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm font-black text-slate-300">
              구글폼 문의
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              오류 내용, 사용 환경, 등록한 검색조건 유형, 문제가 발생한 상황을
              구글폼으로 보내주시면 서비스 개선에 참고하겠습니다.
            </p>

            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-black text-emerald-300 transition hover:bg-emerald-400/20"
            >
              구글폼으로 문의하기
            </a>
          </div>

          <p className="mt-4 text-xs leading-6 text-slate-600">
            문의 내용은 구글폼 응답으로 접수되며, 서비스 오류 확인과 기능 개선
            검토를 위해 사용됩니다.
          </p>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            오류 제보 시 포함하면 좋은 내용
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-sm font-black text-slate-200">
                사용 환경
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                PC 또는 모바일 여부, 브라우저 종류, 알림 권한 허용 여부를 함께
                알려주면 확인이 쉽습니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-sm font-black text-slate-200">
                문제 상황
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                검색조건 등록 실패, 수동 갱신 실패, 알림 미작동, 가격 표시 오류
                등 발생한 상황을 구체적으로 알려주세요.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-sm font-black text-slate-200">
                검색조건 유형
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                유니크 아이템, 희귀 아이템, 옵션 검색, 특정 리그 검색 등 어떤
                조건에서 문제가 발생했는지 알려주면 도움이 됩니다.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="text-sm font-black text-slate-200">
                재현 방법
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                어떤 순서로 클릭하거나 등록했을 때 문제가 발생했는지 알려주면
                빠르게 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            광고 및 제휴 문의
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            POE2 SEARCH RADAR는 향후 광고 또는 관련 서비스 제휴를 검토할 수
            있습니다. 광고, 제휴, 운영 관련 문의도 구글폼을 통해 전달할 수
            있습니다.
          </p>
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
          <Link href="/terms" className="hover:text-emerald-300">
            이용약관
          </Link>
        </footer>
      </div>
    </main>
  );
}