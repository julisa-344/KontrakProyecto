"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function OrdenarSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ordenar = searchParams.get("ordenar") || "";
  const categoria = searchParams.get("categoria") || "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(window.location.search);
    if (e.target.value) {
      params.set("ordenar", e.target.value);
    } else {
      params.delete("ordenar");
    }
    // Mantener la categoría seleccionada
    if (categoria) {
      params.set("categoria", categoria);
    }
    router.push(`/catalogo?${params.toString()}`);
  }

  return (
    <>
      <label htmlFor="ordenar" className="mr-2 font-medium text-gray-700">Ordenar por:</label>
      <select
        id="ordenar"
        name="ordenar"
        className="px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition"
        value={ordenar}
        onChange={handleChange}
      >
        <option value="">Por defecto</option>
        <option value="precio-desc">Precio: mayor a menor</option>
        <option value="precio-asc">Precio: menor a mayor</option>
        <option value="alfabetico">Orden alfabético</option>
      </select>
    </>
  );
}
