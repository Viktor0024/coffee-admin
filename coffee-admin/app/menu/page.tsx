"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { MenuCategoryWithItems, MenuItemDb } from "@/lib/types";
import {
  getMenu,
  createCategory,
  updateCategory,
  deleteCategory,
  createItem,
  updateItem,
  deleteItem,
  seedMenuItemsFromFallback,
} from "./actions";
import styles from "./menu.module.css";

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuCategoryWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingItemFor, setAddingItemFor] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const toggleCategoryCollapsed = (id: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err, isFallback: fallback } = await getMenu();
    setLoading(false);
    setIsFallback(fallback ?? false);
    if (err) setError(err);
    else setMenu(data ?? []);
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.querySelector('[name="catName"]') as HTMLInputElement)?.value?.trim();
    const image = (form.querySelector('[name="catImage"]') as HTMLInputElement)?.value?.trim();
    if (!name) return;
    const { error: err } = await createCategory(name, image || "");
    if (!err) {
      setAddingCategory(false);
      fetchMenu();
    } else setError(err);
  };

  const handleUpdateCategory = async (
    id: string,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.querySelector('[name="editCatName"]') as HTMLInputElement)?.value?.trim();
    const image = (form.querySelector('[name="editCatImage"]') as HTMLInputElement)?.value?.trim();
    if (!name) return;
    const { error: err } = await updateCategory(id, { name, image: image || "" });
    if (!err) {
      setEditingCategoryId(null);
      fetchMenu();
    } else setError(err);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Видалити категорію «${name}» і всі позиції?`)) return;
    const { error: err } = await deleteCategory(id);
    if (!err) fetchMenu();
    else setError(err);
  };

  const handleAddItem = async (
    categoryId: string,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.querySelector('[name="itemName"]') as HTMLInputElement)?.value?.trim();
    const price = parseFloat(
      (form.querySelector('[name="itemPrice"]') as HTMLInputElement)?.value ?? "0"
    );
    const imageUrl = (form.querySelector('[name="itemImage"]') as HTMLInputElement)?.value?.trim();
    if (!name || Number.isNaN(price) || price < 0) return;
    const { error: err } = await createItem(categoryId, name, price, imageUrl || undefined);
    if (!err) {
      setAddingItemFor(null);
      fetchMenu();
    } else setError(err);
  };

  const handleUpdateItem = async (
    item: MenuItemDb,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.querySelector('[name="editItemName"]') as HTMLInputElement)?.value?.trim();
    const price = parseFloat(
      (form.querySelector('[name="editItemPrice"]') as HTMLInputElement)?.value ?? "0"
    );
    const imageUrl = (form.querySelector('[name="editItemImage"]') as HTMLInputElement)?.value?.trim();
    if (!name || Number.isNaN(price) || price < 0) return;
    const { error: err } = await updateItem(item.id, {
      name,
      price,
      image_url: imageUrl || null,
    });
    if (!err) {
      setEditingItemId(null);
      fetchMenu();
    } else setError(err);
  };

  const handleDeleteItem = async (item: MenuItemDb) => {
    if (!confirm(`Видалити «${item.name}» назавжди?`)) return;
    const { error: err } = await deleteItem(item.id);
    if (!err) fetchMenu();
    else setError(err);
  };

  const handleBlockCategory = async (id: string, active: boolean) => {
    const { error: err } = await updateCategory(id, { active });
    if (!err) fetchMenu();
    else setError(err);
  };

  const handleBlockItem = async (id: string, active: boolean) => {
    const { error: err } = await updateItem(id, { active });
    if (!err) fetchMenu();
    else setError(err);
  };

  const handleSeedItems = async () => {
    setSeeding(true);
    setSeedResult(null);
    const { error: err, added } = await seedMenuItemsFromFallback();
    setSeeding(false);
    if (!err) {
      if (added > 0) {
        setSeedResult(`Додано ${added} позицій`);
        fetchMenu();
      } else setSeedResult("Усі позиції вже є в базі");
    } else setError(err);
  };

  if (loading) {
    return (
      <main className={styles.menuPage}>
        <header className={styles.menuHeader}>
          <Link href="/" className={styles.backLink}>
            ← На головну
          </Link>
          <h1 className={styles.menuTitle}>Меню</h1>
        </header>
        <p className={styles.menuEmpty}>Завантаження меню…</p>
      </main>
    );
  }

  return (
    <main className={styles.menuPage}>
      <header className={styles.menuHeader}>
        <Link href="/" className={styles.backLink}>
          ← На головну
        </Link>
        <h1 className={styles.menuTitle}>Меню</h1>
      </header>

      {isFallback && (
        <div className={styles.supabaseHint}>
          Меню показано з резервної копії. Щоб зберігати зміни (додавати, редагувати, видаляти), виконайте міграцію <strong>supabase-menu.sql</strong> у Supabase Dashboard → SQL Editor та перезавантажте сторінку.
        </div>
      )}

      {!isFallback && (
        <div className={styles.seedBlock}>
          <p className={styles.seedText}>Усі позиції (кава, чай, десерти, морозиво) зберігаються в базі — їх можна блокувати та розблоковувати. Якщо позицій ще немає, імпортуйте їх одним кліком.</p>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleSeedItems}
            disabled={seeding}
          >
            {seeding ? "Імпорт…" : "Імпортувати всі позиції з резервного меню"}
          </button>
          {seedResult && <p className={styles.seedResult}>{seedResult}</p>}
        </div>
      )}

      {error && (
        <div className={styles.menuError}>
          {error}
          <button type="button" className={styles.retryButton} onClick={() => fetchMenu()}>
            Повторити
          </button>
        </div>
      )}

      {!error && menu.length === 0 && !addingCategory && (
        <p className={styles.menuEmpty}>
          Ще немає категорій. Додайте категорію нижче або виконайте міграцію supabase-menu.sql у
          Supabase.
        </p>
      )}

      {menu.map((cat) => {
        const isBlocked = cat.active === false;
        const isCollapsed = collapsedCategories.has(cat.id);
        return (
        <section
          key={cat.id}
          className={`${styles.categoryCard} ${isBlocked ? styles.categoryCardBlocked : ""}`}
        >
          <div className={styles.categoryHeader}>
            <div className={styles.categoryImageWrap}>
              {cat.image ? (
                <img
                  src={cat.image}
                  alt=""
                  className={styles.categoryImage}
                  width={56}
                  height={56}
                />
              ) : (
                <div className={styles.categoryImagePlaceholder}>📁</div>
              )}
            </div>
            {editingCategoryId === cat.id ? (
              <form
                className={styles.formRow}
                style={{ flex: 1, flexWrap: "wrap" }}
                onSubmit={(e) => handleUpdateCategory(cat.id, e)}
              >
                <div className={styles.formGroup} style={{ flex: "1 1 200px" }}>
                  <label>Назва</label>
                  <input
                    name="editCatName"
                    defaultValue={cat.name}
                    required
                    placeholder="Назва категорії"
                  />
                </div>
                <div className={styles.formGroup} style={{ flex: "1 1 200px" }}>
                  <label>URL зображення</label>
                  <input
                    name="editCatImage"
                    defaultValue={cat.image}
                    type="url"
                    placeholder="https://..."
                  />
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                  <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                    Зберегти
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setEditingCategoryId(null)}
                  >
                    Скасувати
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h2 className={styles.categoryTitle}>
                  {cat.name}
                  {isBlocked && <span className={styles.blockedBadge}>Заблоковано</span>}
                </h2>
                <div className={styles.categoryActions}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={() => setAddingItemFor(cat.id)}
                  >
                    + Позиція
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setEditingCategoryId(cat.id)}
                  >
                    Редагувати
                  </button>
                  {isBlocked ? (
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      onClick={() => handleBlockCategory(cat.id, true)}
                    >
                      Розблокувати
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => handleBlockCategory(cat.id, false)}
                    >
                      Заблокувати
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDanger}`}
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  >
                    Видалити
                  </button>
                </div>
              </>
            )}
          </div>

          <div className={styles.itemsSectionHeader}>
            <span>Позиції ({cat.items.length})</span>
            <button
              type="button"
              className={styles.itemsSectionToggle}
              onClick={() => toggleCategoryCollapsed(cat.id)}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? "▼ Розгорнути" : "▲ Згорнути"}
            </button>
          </div>

          {!isCollapsed && (
          <ul className={styles.itemsList}>
            {cat.items.map((item) => {
              const itemBlocked = item.active === false;
              return editingItemId === item.id ? (
                <li key={item.id} className={`${styles.itemRow} ${styles.itemRowEditing}`}>
                  <div />
                  <form
                    onSubmit={(e) => handleUpdateItem(item, e)}
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", gridColumn: "2 / -1" }}
                  >
                    <input
                      name="editItemName"
                      defaultValue={item.name}
                      placeholder="Назва"
                      required
                    />
                    <input
                      name="editItemPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={item.price}
                      placeholder="Ціна"
                      style={{ width: "100px" }}
                    />
                    <input
                      name="editItemImage"
                      type="url"
                      defaultValue={item.image_url ?? ""}
                      placeholder="URL фото"
                      style={{ minWidth: "180px" }}
                    />
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                      Зберегти
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => setEditingItemId(null)}
                    >
                      Скасувати
                    </button>
                  </form>
                </li>
              ) : (
                <li
                  key={item.id}
                  className={`${styles.itemRow} ${itemBlocked ? styles.itemRowBlocked : ""}`}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt=""
                      className={styles.itemThumb}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className={styles.itemThumbPlaceholder}>☕</div>
                  )}
                  <span className={styles.itemName}>
                    {item.name}
                    {itemBlocked && <span className={styles.blockedBadge}>Заблоковано</span>}
                  </span>
                  <span className={styles.itemPrice}>€{Number(item.price).toFixed(2)}</span>
                  <div className={styles.itemActions}>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => setEditingItemId(item.id)}
                    >
                      Редагувати
                    </button>
                    {itemBlocked ? (
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={() => handleBlockItem(item.id, true)}
                      >
                        Розблокувати
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        onClick={() => handleBlockItem(item.id, false)}
                      >
                        Заблокувати
                      </button>
                    )}
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnDanger}`}
                      onClick={() => handleDeleteItem(item)}
                    >
                      Видалити
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          )}

          {addingItemFor === cat.id && (
            <div className={styles.addItemForm}>
              <form
                onSubmit={(e) => handleAddItem(cat.id, e)}
                className={styles.formRow}
                style={{ flexWrap: "wrap" }}
              >
                <div className={styles.formGroup}>
                  <label>Назва позиції</label>
                  <input name="itemName" required placeholder="Наприклад: Еспресо" />
                </div>
                <div className={styles.formGroup} style={{ maxWidth: "120px" }}>
                  <label>Ціна (€)</label>
                  <input
                    name="itemPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue="0"
                  />
                </div>
                <div className={styles.formGroup} style={{ minWidth: "200px", flex: "1 1 200px" }}>
                  <label>URL зображення (необовʼязково)</label>
                  <input name="itemImage" type="url" placeholder="https://..." />
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                  <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                    Додати
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setAddingItemFor(null)}
                  >
                    Скасувати
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
        );
      })}

      {!loading && (
        <div className={styles.addCategoryBlock}>
          {addingCategory ? (
            <form onSubmit={handleAddCategory} className={styles.formRow} style={{ flexWrap: "wrap" }}>
              <div className={styles.formGroup} style={{ flex: "1 1 200px" }}>
                <label>Назва категорії</label>
                <input name="catName" required placeholder="Наприклад: Кава" />
              </div>
              <div className={styles.formGroup} style={{ flex: "1 1 200px" }}>
                <label>URL зображення</label>
                <input name="catImage" type="url" placeholder="https://..." />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Зберегти
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setAddingCategory(false)}
                >
                  Скасувати
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3>Нова категорія</h3>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => setAddingCategory(true)}
              >
                + Додати категорію
              </button>
            </>
          )}
        </div>
      )}
    </main>
  );
}
