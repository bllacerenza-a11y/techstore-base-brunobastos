import { useEffect, useState } from 'react'

// Feedback imediato evita que o cliente clique várias vezes sem perceber.
export default function BotaoAdicionar({ produto, onAdicionar, className = 'botao' }) {
    const [adicionado, setAdicionado] = useState(false)
    const semPreco = !Number.isFinite(produto.price)
    const esgotado = produto.estoque === 0

    useEffect(() => {
        if (!adicionado) return
        const temporizador = setTimeout(() => setAdicionado(false), 1500)
        return () => clearTimeout(temporizador)
    }, [adicionado])

    function adicionar() {
        if (adicionado || semPreco || esgotado) return
        if (onAdicionar(produto)) {
            setAdicionado(true)
        }
    }

    let texto = 'Adicionar ao carrinho'
    if (semPreco) texto = 'Aguardando preço'
    if (esgotado) texto = 'Esgotado'
    if (adicionado) texto = '✓ Adicionado!'

    return (
        <button
            type="button"
            className={className}
            onClick={adicionar}
            disabled={semPreco || esgotado || adicionado}
            aria-live="polite"
        >
            {texto}
        </button>
    )
}
