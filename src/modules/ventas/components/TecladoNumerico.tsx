interface TecladoNumericoProps {
  onInput: (value: string) => void
}

const TecladoNumerico = ({ onInput }: TecladoNumericoProps) => {
  const numeros = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'C']

  return (
    <div className="teclado-numerico">
      {numeros.map((num) => (
        <button
          key={num}
          onClick={() => onInput(num)}
          className="btn-teclado"
        >
          {num}
        </button>
      ))}
    </div>
  )
}

export default TecladoNumerico
