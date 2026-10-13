import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('techstore-lista-espera') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    }).catch(() => setClientes([]))
  }, [])

  // A API fornecida oferece apenas consultas GET. Guardamos o cadastro no
  // navegador para a atividade; um sistema real precisaria de um servidor.
  useEffect(() => {
    localStorage.setItem('techstore-lista-espera', JSON.stringify(listaEspera))
  }, [listaEspera])

  function adicionarAoCarrinho(produto) {
    if (!Number.isFinite(produto.price) || produto.estoque === 0) return false
    const quantidade = carrinho.filter((item) => item.id === produto.id).length
    if (quantidade >= produto.estoque) return false
    setCarrinho((anterior) => anterior.concat(produto))
    return true
  }

  function removerUmaUnidade(produtoId) {
    setCarrinho((anterior) => {
      const indice = anterior.findIndex((produto) => produto.id === produtoId)
      if (indice === -1) return anterior
      return anterior.filter((produto, posicao) => posicao !== indice)
    })
  }

  function cadastrarInteresse(produtoId, nome, email) {
    const nomeLimpo = nome.trim()
    const emailLimpo = email.trim().toLowerCase()
    if (!nomeLimpo || !emailLimpo) {
      return { ok: false, mensagem: 'Informe nome e e-mail.' }
    }
    const jaCadastrado = listaEspera.some(
      (pessoa) => pessoa.produtoId === produtoId && pessoa.email === emailLimpo
    )
    if (jaCadastrado) {
      return { ok: false, mensagem: 'Este e-mail já está na lista desse produto.' }
    }
    setListaEspera((anterior) => anterior.concat({ produtoId, nome: nomeLimpo, email: emailLimpo }))
    return { ok: true, mensagem: 'Cadastro realizado! Você entrou na lista de espera.' }
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route path="/" element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />} />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onAvisar={cadastrarInteresse}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route path="/estoque" element={<Estoque produtos={produtos} listaEspera={listaEspera} />} />
            <Route path="*" element={<p>Essa página não existe. Volte para a <Link to="/">loja</Link>.</p>} />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
