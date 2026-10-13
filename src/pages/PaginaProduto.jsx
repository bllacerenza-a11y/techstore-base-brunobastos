import { useState } from 'react'
import { Link, useParams } from 'react-router'
import BotaoAdicionar from '../components/BotãoAdicionar'
import ProdutoCard from '../components/ProdutoCard'
import { formatarPreco } from '../utils/formatarPreco'

export default function PaginaProduto({ produtos, onAdicionar, onAvisar }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">Voltar para a loja</Link>
      </div>
    )
  }

  // Mesmo escondido na loja, o produto esgotado continua acessível pelo link.
  const relacionados = produtos
    .filter((item) =>
      item.category === produto.category && item.id !== produto.id && item.estoque > 0
    )
    .slice(0, 4)

  function pedirAviso(evento) {
    evento.preventDefault()
    const resultado = onAvisar(produto.id, nome, email)
    setMensagem(resultado.mensagem)
    if (resultado.ok) {
      setNome('')
      setEmail('')
    }
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {Number.isFinite(produto.price) ? formatarPreco(produto.price) : 'Preço em definição'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {produto.estoque === 0 ? 'Produto esgotado' : `${produto.estoque} unidades disponíveis`}
          </p>

          {produto.estoque === 0 ? (
            <form className="form-aviso" onSubmit={pedirAviso}>
              <h2>Avise-me quando voltar</h2>
              <p>Deixe seu nome e e-mail para entrar na lista de espera.</p>
              <label htmlFor="nome-aviso">Nome</label>
              <input
                id="nome-aviso"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                required
                placeholder="Seu nome"
              />
              <label htmlFor="email-aviso">E-mail</label>
              <input
                id="email-aviso"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                required
                placeholder="seu@email.com"
              />
              <button className="botao botao-grande" type="submit">Quero ser avisado</button>
              {mensagem && <p className="mensagem-cupom" role="status">{mensagem}</p>}
            </form>
          ) : (
            <BotaoAdicionar
              produto={produto}
              onAdicionar={onAdicionar}
              className="botao botao-grande"
            />
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      {relacionados.length > 0 && (
        <>
          <h2>Produtos relacionados</h2>
          <div className="grade">
            {relacionados.map((item) => (
              <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
