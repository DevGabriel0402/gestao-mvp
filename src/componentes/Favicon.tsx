import { useEffect } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { RiUserSettingsFill } from 'react-icons/ri'

export function Favicon() {
    useEffect(() => {
        // Renderiza o ícone como string SVG estática
        const svgString = renderToStaticMarkup(
            <RiUserSettingsFill
                size={32}
                color="#3b82f6" // Azul Primary (pode ajustar se quiser outra cor)
                style={{ verticalAlign: 'middle' }} // Garante alinhamento se for usado em outro lugar, mas no favicon não afeta
                xmlns="http://www.w3.org/2000/svg" // Garante namespace
            />
        )

        // Codifica para Data URI
        const encodedSvg = encodeURIComponent(svgString)
        const dataUrl = `data:image/svg+xml,${encodedSvg}`

        // Atualiza a tag no head
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
        if (link) {
            link.href = dataUrl
            link.type = 'image/svg+xml'
        } else {
            const newLink = document.createElement('link')
            newLink.rel = 'icon'
            newLink.href = dataUrl
            newLink.type = 'image/svg+xml'
            document.head.appendChild(newLink)
        }
    }, [])

    return null
}
