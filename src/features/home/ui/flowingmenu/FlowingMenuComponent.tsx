import FlowingMenu from './FlowingMenu'

const demoItems = [
    { link: '#', text: 'Krish Kalaria', image: 'https://picsum.photos/600/400?random=1' },
    { link: '#', text: 'Aryan Sharma', image: 'https://picsum.photos/600/400?random=2' },
    { link: '#', text: 'Rakshana V', image: 'https://picsum.photos/600/400?random=3' },
    { link: '#', text: 'Suhas Koheda', image: 'https://picsum.photos/600/400?random=4' }
];

export default function FlowingMenuComponent() {
    return (
        <div className="flex flex-col items-center justify-center bg-[#030619] text-white h-[600px]">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Meet Our Talented Team
            </h2>
            <div className="relative w-full h-full">
                <FlowingMenu items={demoItems}/>
            </div>
        </div>
    );
}