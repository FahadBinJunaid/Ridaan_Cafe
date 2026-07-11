"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/manage-category";
import {
  getMenuItemsForCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItem,
} from "@/actions/manage-menu-item";
import { getCloudinarySignature } from "@/actions/get-cloudinary-signature";

interface Category {
  id: string;
  name: string;
  display_order: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string | null;
  is_available: boolean;
}

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [catForm, setCatForm] = useState({ name: "", display_order: 0 });
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
      }
    } catch {
      setStatus({ type: "error", message: "Failed to load categories" });
    }
  }, [selectedCategoryId]);

  const loadMenuItems = useCallback(async (categoryId: string) => {
    try {
      const data = await getMenuItemsForCategory(categoryId);
      setMenuItems(data);
    } catch {
      setMenuItems([]);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (selectedCategoryId) {
      loadMenuItems(selectedCategoryId);
    }
  }, [selectedCategoryId, loadMenuItems]);

  function showStatus(type: "success" | "error", message: string) {
    setStatus({ type, message });
    setTimeout(() => setStatus(null), 4000);
  }

  async function handleSaveCategory(formData: FormData) {
    const res = editingCat
      ? await updateCategory(formData)
      : await createCategory(formData);
    if (res.error) {
      showStatus(
        "error",
        typeof res.error === "string" ? res.error : "Validation failed",
      );
    } else {
      showStatus("success", editingCat ? "Category updated" : "Category created");
      setEditingCat(null);
      setCatForm({ name: "", display_order: 0 });
      loadCategories();
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    const fd = new FormData();
    fd.set("id", id);
    const res = await deleteCategory(fd);
    if (res.error) {
      showStatus("error", res.error);
    } else {
      showStatus("success", "Category deleted");
      loadCategories();
    }
  }

  function startEditCategory(cat: Category) {
    setEditingCat(cat);
    setCatForm({ name: cat.name, display_order: cat.display_order });
  }

  function startNewCategory() {
    setEditingCat(null);
    setCatForm({ name: "", display_order: categories.length });
  }

  async function handleSaveItem(formData: FormData) {
    const res = editingItem
      ? await updateMenuItem(formData)
      : await createMenuItem(formData);
    if (res.error) {
      showStatus(
        "error",
        typeof res.error === "string" ? res.error : "Validation failed",
      );
    } else {
      showStatus("success", editingItem ? "Item updated" : "Item created");
      setEditingItem(null);
      setItemForm({
        name: "",
        description: "",
        price: "",
        image_url: "",
      });
      if (selectedCategoryId) loadMenuItems(selectedCategoryId);
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm("Delete this menu item?")) return;
    const fd = new FormData();
    fd.set("id", id);
    const res = await deleteMenuItem(fd);
    if (res.error) {
      showStatus("error", res.error);
    } else {
      showStatus("success", "Item deleted");
      if (selectedCategoryId) loadMenuItems(selectedCategoryId);
    }
  }

  async function handleToggleItem(id: string, current: boolean) {
    const fd = new FormData();
    fd.set("id", id);
    fd.set("available", String(!current));
    const res = await toggleMenuItem(fd);
    if (res.error) {
      showStatus("error", res.error);
    } else {
      showStatus("success", "Availability toggled");
      if (selectedCategoryId) loadMenuItems(selectedCategoryId);
    }
  }

  function startEditItem(item: MenuItem) {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      image_url: item.image_url || "",
    });
  }

  function startNewItem() {
    setEditingItem(null);
    setItemForm({ name: "", description: "", price: "", image_url: "" });
  }

  async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const sig = await getCloudinarySignature();

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("timestamp", String(sig.timestamp));
      uploadData.append("signature", sig.signature);
      uploadData.append("api_key", sig.api_key!);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
        { method: "POST", body: uploadData },
      );
      const data = await res.json();

      if (data.secure_url) {
        setItemForm((prev) => ({ ...prev, image_url: data.secure_url }));
        showStatus("success", "Image uploaded");
      } else {
        showStatus("error", data.error?.message || "Upload failed");
      }
    } catch {
      showStatus("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-foreground">
        Menu Management
      </h1>

      {status && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-green-500/50 bg-green-500/10 text-green-700"
              : "border-destructive/50 bg-destructive/10 text-destructive"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Categories */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Categories
            </h2>
            <button
              type="button"
              onClick={startNewCategory}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              + Add
            </button>
          </div>

          {/* Category Form */}
          {(catForm.name !== undefined || editingCat) && (
            <form
              action={handleSaveCategory}
              className="mb-4 rounded-lg border border-border bg-card p-4"
            >
              <input
                name="id"
                type="hidden"
                value={editingCat?.id || ""}
              />
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    name="name"
                    required
                    value={catForm.name}
                    onChange={(e) =>
                      setCatForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Display Order
                  </label>
                  <input
                    name="display_order"
                    type="number"
                    min="0"
                    required
                    value={catForm.display_order}
                    onChange={(e) =>
                      setCatForm((p) => ({
                        ...p,
                        display_order: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {editingCat ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCat(null);
                      setCatForm({ name: "", display_order: 0 });
                    }}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Category List */}
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                  selectedCategoryId === cat.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-accent"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-medium text-foreground">
                    {cat.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Order: {cat.display_order}
                  </p>
                </button>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => startEditCategory(cat)}
                    className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="rounded px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    Del
                  </button>
                </div>
              </li>
            ))}
            {categories.length === 0 && (
              <li className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No categories yet. Click + Add to create one.
              </li>
            )}
          </ul>
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Menu Items
              {selectedCategoryId && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  —{" "}
                  {categories.find((c) => c.id === selectedCategoryId)?.name ||
                    ""}
                </span>
              )}
            </h2>
            {selectedCategoryId && (
              <button
                type="button"
                onClick={startNewItem}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                + Add Item
              </button>
            )}
          </div>

          {/* Item Form */}
          {(itemForm.name !== undefined || editingItem) && (
            <form
              action={handleSaveItem}
              className="mb-4 rounded-lg border border-border bg-card p-4"
            >
              <input name="id" type="hidden" value={editingItem?.id || ""} />
              <input
                name="category_id"
                type="hidden"
                value={selectedCategoryId || ""}
              />
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Name
                    </label>
                    <input
                      name="name"
                      required
                      value={itemForm.name}
                      onChange={(e) =>
                        setItemForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-foreground">
                      Price
                    </label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={itemForm.price}
                      onChange={(e) =>
                        setItemForm((p) => ({ ...p, price: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    value={itemForm.description}
                    onChange={(e) =>
                      setItemForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">
                    Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="image_url"
                      value={itemForm.image_url}
                      onChange={(e) =>
                        setItemForm((p) => ({
                          ...p,
                          image_url: e.target.value,
                        }))
                      }
                      placeholder="https://res.cloudinary.com/..."
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <label className="flex cursor-pointer items-center rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
                      {uploading ? "..." : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {itemForm.image_url && (
                    <img
                      src={itemForm.image_url}
                      alt="Preview"
                      className="mt-2 h-24 w-24 rounded-lg border border-border object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {editingItem ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setItemForm({
                        name: "",
                        description: "",
                        price: "",
                        image_url: "",
                      });
                    }}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Menu Items List */}
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`rounded-lg border px-4 py-3 transition-colors ${
                  !item.is_available
                    ? "border-border/50 bg-muted/30 opacity-60"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {item.name}
                      </p>
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          item.is_available
                            ? "bg-green-500"
                            : "bg-muted-foreground"
                        }`}
                        title={item.is_available ? "Available" : "Unavailable"}
                      />
                    </div>
                    {item.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-primary">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt=""
                        className="h-10 w-10 rounded-md border border-border object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div className="flex flex-col gap-1">
                      <form>
                        <input
                          type="hidden"
                          name="id"
                          value={item.id}
                        />
                        <input
                          type="hidden"
                          name="available"
                          value={String(item.is_available)}
                        />
                        <button
                          type="button"
                          onClick={() => handleToggleItem(item.id, item.is_available)}
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            item.is_available
                              ? "text-muted-foreground hover:bg-accent"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {item.is_available ? "Hide" : "Show"}
                        </button>
                      </form>
                      <button
                        type="button"
                        onClick={() => startEditItem(item)}
                        className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="rounded px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {menuItems.length === 0 && selectedCategoryId ? (
              <li className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                No items in this category. Click + Add Item to create one.
              </li>
            ) : !selectedCategoryId ? (
              <li className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                Select a category on the left to see its menu items.
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
