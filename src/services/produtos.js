import { get } from './api'

// A API mistura preços numéricos, preços em texto e produtos sem preço.
// Convertemos os valores aqui para toda a loja trabalhar do mesmo jeito.
export function buscarProdutos() {
  return get('/products.json').then((dados) =>
    dados.map((produto) => ({
      ...produto,
      price:
        produto.price === undefined || produto.price === null || produto.price === ''
          ? null
          : Number(produto.price),
      precoOriginal:
        produto.precoOriginal === undefined || produto.precoOriginal === null
          ? null
          : Number(produto.precoOriginal),
    }))
  )
}
