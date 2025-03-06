export default function SidebarButton() {
  return (
    <button className="p-[3px] relative">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg items-center" />
      <div
        className="px-8 py-2  bg-[#030617] rounded-[6px]  relative group transition duration-200 text-white ">
        FetchHive
      </div>
    </button>
  )
}