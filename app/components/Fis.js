export default function Fis({ siparis, kalemler, isletmeAdi, alinanPara }) {
  const paraUstu = alinanPara ? Number(alinanPara) - siparis.toplam : 0

  function yazdir() {
    window.print()
  }

  return (
    <>
      <div className="no-print flex justify-end mb-4">
        <button
          onClick={yazdir}
          className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90"
        >
          Yazdır
        </button>
      </div>

      <div id="fis" className="font-mono text-sm max-w-xs mx-auto text-black">
        <div className="text-center mb-4">
          <div className="text-lg font-bold">{isletmeAdi}</div>
          <div className="text-xs text-gray-500">
            {new Date().toLocaleString("tr-TR")}
          </div>
          <div className="text-xs text-gray-500">Sipariş #{siparis.id}</div>
        </div>

        <div className="border-t border-dashed border-gray-400 my-3" />

        {kalemler.map((kalem, i) => (
          <div key={i} className="flex justify-between mb-1">
            <span>{kalem.urun_adi} x{kalem.adet}</span>
            <span>{(kalem.fiyat * kalem.adet).toLocaleString()} IQD</span>
          </div>
        ))}

        <div className="border-t border-dashed border-gray-400 my-3" />

        <div className="flex justify-between font-bold text-base mb-1">
          <span>Toplam</span>
          <span>{siparis.toplam.toLocaleString()} IQD</span>
        </div>

        {alinanPara && (
          <>
            <div className="flex justify-between mb-1">
              <span>Alınan</span>
              <span>{Number(alinanPara).toLocaleString()} IQD</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Para üstü</span>
              <span>{paraUstu.toLocaleString()} IQD</span>
            </div>
          </>
        )}

        <div className="border-t border-dashed border-gray-400 my-3" />

        <div className="text-center text-xs text-gray-500 mt-4">
          Teşekkür ederiz
        </div>
      </div>
    </>
  )
}