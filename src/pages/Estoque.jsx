// Página interna: estoque e lista de clientes interessados nos itens esgotados.
export default function Estoque({ produtos, listaEspera }) {
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>
      <p className="aviso">
        Pessoas na lista de espera: <strong>{listaEspera.length}</strong>
      </p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
              <th>Lista de espera</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => {
              const interessados = listaEspera.filter((pessoa) => pessoa.produtoId === produto.id)
              return (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                  <td>
                    {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                    {produto.estoque > 0 && produto.estoque < 5 && (
                      <span className="selo selo-alerta">Repor</span>
                    )}
                    {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                  </td>
                  <td>
                    {interessados.length === 0 ? (
                      '—'
                    ) : (
                      <div className="interessados">
                        <strong>{interessados.length} interessado(s)</strong>
                        {interessados.map((pessoa) => (
                          <p key={pessoa.email}>
                            {pessoa.nome} · {pessoa.email}
                          </p>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
