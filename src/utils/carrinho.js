// O carrinho guarda uma entrada por unidade adicionada.
// Somar centavos evita pequenos erros com números decimais.
export function calcularTotal(carrinho) {
  const centavos = carrinho.reduce(
    (total, produto) => total + Math.round(Number(produto.price) * 100),
    0
  )
  return centavos / 100
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
