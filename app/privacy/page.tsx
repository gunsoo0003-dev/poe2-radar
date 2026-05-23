import Link from 'next/link';

export default function PrivacyPage() {
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
            Privacy Policy
          </p>

          <h1 className="mt-3 text-3xl font-black text-amber-100 md:text-4xl">
            개인정보처리방침
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            POE2 SEARCH RADAR는 사용자의 개인정보 보호를 중요하게 생각합니다.
            본 페이지는 서비스 이용 과정에서 처리될 수 있는 정보와 그 목적을
            설명합니다.
          </p>
        </header>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            수집하는 정보
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              현재 POE2 SEARCH RADAR는 별도의 회원가입 기능을 제공하지
              않습니다. 따라서 이름, 전화번호, 주소와 같은 직접적인 개인정보를
              회원 데이터베이스에 저장하지 않습니다.
            </p>

            <p>
              사용자가 등록한 공식 거래소 검색 URL, 감시조건, 감시 결과
              snapshot, 알림 상태 등은 현재 브라우저의 localStorage에 저장될 수
              있습니다.
            </p>

            <p>
              localStorage에 저장된 정보는 사용자의 브라우저에 보관되며,
              브라우저 데이터 삭제 또는 사이트 데이터 삭제 시 함께 삭제될 수
              있습니다.
            </p>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            정보 이용 목적
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              저장된 감시조건은 사용자가 등록한 POE2 공식 거래소 검색조건을 다시
              불러오고, 신규 매물과 최저가 변화를 확인하기 위해 사용됩니다.
            </p>

            <p>
              알림 상태 정보는 동일한 조건에 대해 반복 알림이 과도하게 발생하지
              않도록 제한하는 목적으로 사용됩니다.
            </p>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            쿠키 및 광고
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              본 사이트는 향후 Google AdSense 등 제3자 광고 서비스를 사용할 수
              있습니다. 이 경우 Google을 포함한 제3자 광고 제공업체는 쿠키 또는
              유사 기술을 사용하여 사용자의 이전 방문 기록이나 관심사에 기반한
              광고를 제공할 수 있습니다.
            </p>

            <p>
              사용자는 브라우저 설정 또는 Google 광고 설정 페이지를 통해
              개인 맞춤 광고 사용 여부를 관리할 수 있습니다.
            </p>

            <p>
              광고 서비스 제공 과정에서 처리되는 정보는 각 광고 제공업체의
              개인정보처리방침과 정책을 따를 수 있습니다.
            </p>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            외부 서비스 및 공식 거래소
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              POE2 SEARCH RADAR는 사용자가 입력한 공식 거래소 검색 URL을
              바탕으로 검색 결과를 확인하는 도구입니다.
            </p>

            <p>
              Path of Exile 2 및 공식 거래소와 관련된 권리와 데이터 정책은 해당
              서비스 운영 주체의 정책을 따릅니다. 본 사이트는 Path of Exile 2의
              공식 서비스가 아닙니다.
            </p>
          </div>
        </section>

        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-6">
          <h2 className="text-xl font-black text-white">
            개인정보처리방침 변경
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-400">
            <p>
              서비스 기능 추가, 광고 서비스 적용, 저장 방식 변경 등에 따라 본
              개인정보처리방침은 수정될 수 있습니다. 변경 사항은 본 페이지를
              통해 안내됩니다.
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