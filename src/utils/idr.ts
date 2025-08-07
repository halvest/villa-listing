// src/utils/idr.ts

/**
 * Mengubah angka menjadi format mata uang Rupiah yang mudah dibaca.
 * Contoh: 300000000 -> "Rp 300 Juta"
 * Contoh: 1500000000 -> "Rp 1.5 Miliar"
 * @param price Angka harga
 * @returns String harga dalam format yang mudah dibaca
 */
export const formatHarga = (price: number): string => {
  if (!price) return "Rp 0";

  if (price >= 1_000_000_000) {
    const value = price / 1_000_000_000;
    return `Rp ${value.toLocaleString('id-ID', { maximumFractionDigits: 2 })} Miliar`;
  }
  if (price >= 1_000_000) {
    const value = price / 1_000_000;
    return `Rp ${value.toLocaleString('id-ID')} Juta`;
  }
  return `Rp ${price.toLocaleString('id-ID')}`;
};