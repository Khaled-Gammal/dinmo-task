
import { Loader } from 'lucide-react'

function MainSkelton() {
    return (
        <div className="flex justify-center items-center h-screen">
            <p className="animate-spin text-gray-400 text-4xl"><Loader /></p>
        </div>
    )
}

export default MainSkelton
