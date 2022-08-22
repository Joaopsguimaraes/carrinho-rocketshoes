import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  /**
   * @const cart - State do cart obtendo valor inicial caso tenha valor em local storage,
   * caso nao tenha será retornado um array vazio.
   */
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  /**
   * @const addProduct - função responsável por adicionar produtos no carrinho,
   * validando se o produto está no carrinho pelo product.id,
   * validando o estoque do produto pela api do backend,
   */
  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart];
      const productExists = updatedCart.find(product => product.id === productId);

      const stock = await api.get(`/stock/${productId}`);
      const stockAmount = stock.data.amount;
      const currentAmount = productExists ? productExists.amount : 0;
      const amount = currentAmount + 1;

      if(amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if(productExists) {
        productExists.amount = amount;
      }else{
        const product = await api.get(`/products/${productId}`);

        const newProduct = {
          ...product.data,
          amount: 1
        }
        updatedCart.push(newProduct);
      }

      setCart(updatedCart);
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
    } catch {
        toast.error('Erro na adição do produto');
    }
  };

  /**
   * @const removeProduct - Responsavel por remover o produto do carrinho,
   * obtendo o index do carrinho com a const productIndex, e validando se o produto
   * existe para ser removido e setando o novo estado no carrinho na storage
   */
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

  /**
   * @const updateProductAmount - Responsavel por atualizar a quantidade de produtos no carrinho,
   * validando se existe o produto no carrinho e se possui quantidade no estoque, pela api.
   * Caso o produto exista no carrinho e possui estoque, é mudado o valor do estado e setado em
   * local storage
   */
  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount <= 0 ){
        return;
      }

      const stock = await api.get(`/stock/${productId}`);
      const stockAmount = stock.data.amount;

      if(amount > stockAmount){
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }
      
      const updatedCart = [...cart];
      const productExists = updatedCart.find(product => product.id === productId);

      if(productExists){
        productExists.amount = amount;
        setCart(updatedCart);
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart));
      } else{
        throw new Error();
      }

    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * @function useCart - Hook personalizado para obter valores e funcionalidades da context.
 */
export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
