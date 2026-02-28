import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Coffee Admin</h1>
      <p>Панель адміністратора замовлень та меню.</p>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
        <li style={{ marginBottom: "0.75rem" }}>
          <Link href="/orders" style={{ color: "#6b5344" }}>Замовлення →</Link>
        </li>
        <li>
          <Link href="/menu" style={{ color: "#6b5344" }}>Меню →</Link>
        </li>
      </ul>
    </main>
  );
}
