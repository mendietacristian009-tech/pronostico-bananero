import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Producto } from '../types/types';

type CarritoItem = {
  producto: Producto;
  cantidad: number;
};

type CarritoState = {
  items: CarritoItem[];
  cantidadTotal: number;
};

type CarritoAction =
  | { type: 'AGREGAR_PRODUCTO'; payload: Producto }
  | { type: 'REMOVER_PRODUCTO'; payload: string }
  | { type: 'ACTUALIZAR_CANTIDAD'; payload: { id: string; cantidad: number } }
  | { type: 'VACIAR_CARRITO' };

const initialState: CarritoState = {
  items: [],
  cantidadTotal: 0,
};

const carritoReducer = (state: CarritoState, action: CarritoAction): CarritoState => {
  switch (action.type) {
    case 'AGREGAR_PRODUCTO': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.producto.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].cantidad += 1;
        
        return {
          ...state,
          items: updatedItems,
          cantidadTotal: state.cantidadTotal + 1,
        };
      } else {
        return {
          ...state,
          items: [...state.items, { producto: action.payload, cantidad: 1 }],
          cantidadTotal: state.cantidadTotal + 1,
        };
      }
    }
    
    case 'REMOVER_PRODUCTO': {
      const itemToRemove = state.items.find(item => item.producto.id === action.payload);
      if (!itemToRemove) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item.producto.id !== action.payload),
        cantidadTotal: state.cantidadTotal - itemToRemove.cantidad,
      };
    }
    
    case 'ACTUALIZAR_CANTIDAD': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.producto.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        const diferencia = action.payload.cantidad - updatedItems[existingItemIndex].cantidad;
        updatedItems[existingItemIndex].cantidad = action.payload.cantidad;
        
        if (updatedItems[existingItemIndex].cantidad <= 0) {
          return {
            ...state,
            items: state.items.filter(item => item.producto.id !== action.payload.id),
            cantidadTotal: state.cantidadTotal - state.items[existingItemIndex].cantidad,
          };
        }
        
        return {
          ...state,
          items: updatedItems,
          cantidadTotal: state.cantidadTotal + diferencia,
        };
      }
      return state;
    }
    
    case 'VACIAR_CARRITO':
      return initialState;
      
    default:
      return state;
  }
};

type CarritoContextType = {
  carrito: CarritoState;
  agregarProducto: (producto: Producto) => void;
  removerProducto: (id: string) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  calcularTotal: () => number;
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [carrito, dispatch] = useReducer(carritoReducer, initialState);

  const agregarProducto = (producto: Producto) => {
    dispatch({ type: 'AGREGAR_PRODUCTO', payload: producto });
  };

  const removerProducto = (id: string) => {
    dispatch({ type: 'REMOVER_PRODUCTO', payload: id });
  };

  const actualizarCantidad = (id: string, cantidad: number) => {
    dispatch({ type: 'ACTUALIZAR_CANTIDAD', payload: { id, cantidad } });
  };

  const vaciarCarrito = () => {
    dispatch({ type: 'VACIAR_CARRITO' });
  };

  const calcularTotal = () => {
    return carrito.items.reduce(
      (total, item) => total + item.producto.precio * item.cantidad,
      0
    );
  };

  const value = {
    carrito,
    agregarProducto,
    removerProducto,
    actualizarCantidad,
    vaciarCarrito,
    calcularTotal,
  };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
};

export const useCarrito = (): CarritoContextType => {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};