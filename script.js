$(document).ready(function() {
    const $listaProdutos = $('#lista-produtos');
    const $listaCarrinho = $('#lista-carrinho');
    const $carrinhoTotalValor = $('#carrinho-total-valor');
    const $carrinhoStatus = $('.carrinho-status');

    function atualizarTotalCarrinho() {
        let total = 0;
        $listaCarrinho.find('.item-no-carrinho').each(function() {
            const preco = parseFloat($(this).data('preco'));
            const quantidade = parseInt($(this).find('.qtd-val').text());
            total += preco * quantidade;
        });
        $carrinhoTotalValor.text(total.toFixed(2));

        if ($listaCarrinho.find('.item-no-carrinho').length > 0) {
            $carrinhoStatus.hide();
        } else {
            $carrinhoStatus.show();
        }
    }

    $listaProdutos.on('click', '.add-btn', function() {
        const $botao = $(this);
        const $produtoItem = $botao.closest('.produto-item');
        const produtoId = $produtoItem.data('id');
        const nome = $produtoItem.data('nome');
        const preco = parseFloat($produtoItem.data('preco'));

        const $estoqueQtdSpan = $produtoItem.find('.estoque-qtd');
        let estoqueAtual = parseInt($estoqueQtdSpan.text());

        if (estoqueAtual > 0) {
            estoqueAtual--;
            $estoqueQtdSpan.text(estoqueAtual);

            if (estoqueAtual === 0) {
                $botao.prop('disabled', true).text('Esgotado');
            }

            let $itemExistente = $listaCarrinho.find(`.item-no-carrinho[data-id="${produtoId}"]`);

            if ($itemExistente.length > 0) {
                const $qtdValSpan = $itemExistente.find('.qtd-val');
                let qtdAtual = parseInt($qtdValSpan.text());
                qtdAtual++;
                $qtdValSpan.text(qtdAtual);
            } else {
                const itemCarrinhoHTML = `
                    <div class="item-no-carrinho" data-id="${produtoId}" data-preco="${preco.toFixed(2)}">
                        <p>${nome} - R$ ${preco.toFixed(2)} (Qtd: <span class="qtd-val">1</span>)</p>
                        <button class="remove-btn">Remover</button>
                    </div>`;
                $listaCarrinho.append(itemCarrinhoHTML);
            }
            atualizarTotalCarrinho();
        }
    });

    $listaCarrinho.on('click', '.remove-btn', function() {
        const $itemNoCarrinho = $(this).closest('.item-no-carrinho');
        const produtoId = $itemNoCarrinho.data('id');

        const $produtoOriginalNoCatalogo = $listaProdutos.find(`.produto-item[data-id="${produtoId}"]`);
        if ($produtoOriginalNoCatalogo.length > 0) {
            const $estoqueQtdSpan = $produtoOriginalNoCatalogo.find('.estoque-qtd');
            let estoqueAtualCatalogo = parseInt($estoqueQtdSpan.text());
            estoqueAtualCatalogo++;
            $estoqueQtdSpan.text(estoqueAtualCatalogo);
            $produtoOriginalNoCatalogo.find('.add-btn').prop('disabled', false).text('Adicionar');
        }

        const $qtdValSpan = $itemNoCarrinho.find('.qtd-val');
        let qtdNoCarrinho = parseInt($qtdValSpan.text());
        qtdNoCarrinho--;

        if (qtdNoCarrinho > 0) {
            $qtdValSpan.text(qtdNoCarrinho);
        } else {
            $itemNoCarrinho.remove();
        }
        atualizarTotalCarrinho();
    });

    atualizarTotalCarrinho();
});