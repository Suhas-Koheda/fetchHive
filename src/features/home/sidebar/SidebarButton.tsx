export default function SidebarButton() {
  return (
    <button className="relative p-[3px]">
      <div className="absolute inset-0 items-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500" />
      <div className="group relative rounded-[6px] bg-[#030617] px-8 py-2 text-white transition duration-200">
        FetchHive
      </div>
    </button>
  );
}
