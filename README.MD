## 🛒 Basic POC - Cart

Essa é aplicação onde o seu principal objetivo é criar um hook de carrinho de compras. Você vera funcionalidades basicas e funcionamentos em hooks e context api, sao algumas das funcionalidades:

- Adicionar um novo produto ao carrinho;
- Remover um produto do carrinho;
- Alterar a quantidade de um produto no carrinho;
- Cálculo dos preços sub-total e total do carrinho;
- Validação de estoque;
- Exibição de mensagens de erro;
- Entre outros.

**Fake API com JSON Server**: Vamos utilizar o JSON Server para simular uma API que possui as informações dos produtos e do estoque.

### Preservando carrinho com localStorage API

Para preservar os dados do carrinho mesmo se fecharmos a aplicação, utilizaremos a **localStorage API**

Essa é uma API que nos permite persistir dados no navegador em um esquema de chave-valor (semelhante ao que temos com objetos JSON). Como essa é uma API global, você não precisa importar nada antes de usar. 

Para salvar os dados, você deve utilizar o método `setItem`. Como primeiro argumento você deve informar o nome que você quer dar para o registro.
```tsx
  const removeProduct = (productId: number) => {
    try {
      const updateCart = [...cart];
      const productIndex = updateCart.findIndex( product => product.id === productId);

      if(productIndex >= 0){
        updateCart.splice(productIndex, 1);
        setCart(updateCart);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updateCart));
      }else{
        throw Error();
      }

    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

```

Caso queira enviar um valor para o registro que não esteja no formato string, é preciso tratá-lo (ex.: JSON.stringify). Isso fará com que um objeto, lista, número ou qualquer outro valor seja convertido para uma string.

Para recuperar os dados, você deve utilizar o método `getItem` passando como argumento do registro.

```tsx
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

```

O valor retornado pelo método getItem é sempre no formato string. Caso você queira utilizar esse dado em outro formato, é preciso tratá-los (ex.: JSON.parse). Isso irá converter a informação ao estado original de quando foi salva com o JSON.strigify, seja uma lista, um objeto ou outro tipo de dado.

Caso queira estudar mais sobre a **localStorage API**, dê uma olhada aqui

[Window.localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)

### Mostrando erros com toastify

Para mostrar os erros em tela, iremos utilizar um pacote chamado **react-toastify**. Ela ajuda a mostra informações temporárias e rápidas de uma forma bem bonita.

De todos os métodos, utilizaremos apenas o `error` e será obrigatório utilizar mensagens predefinidas para que os testes passem (veremos mais sobre isso)

Caso queira estudar mais sobre a **react-toastify**, dê uma olhada aqui

[fkhadra/react-toastify](https://github.com/fkhadra/react-toastify#readme)

