import Image from "next/image";

const Logo = () => {
    return (
        <Image
            src="/logo.svg"
            alt="Logo"
            width={100}
            height={100}
        />
    )
}

export default Logo;