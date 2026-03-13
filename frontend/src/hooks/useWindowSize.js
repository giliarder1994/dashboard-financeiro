import { useState, useEffect } from "react";

function useWindowSize() {
    const [largura, setLargura] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setLargura(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return { isMobile: largura <= 768, largura };
}

export default useWindowSize;