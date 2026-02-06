import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Coffee Admin</h1>
      <p>Панель адміністратора замовлень.</p>
      <p>
        <Link href="/orders" style={{ color: "#6b5344" }}>Замовлення →</Link>
      </p>
    </main>
  );
}
