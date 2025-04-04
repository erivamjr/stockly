interface ParamsProps {
  params: {
    id: string
  }
}
const ProductsDetailsPage = ({params: {id}}: ParamsProps) => {
  return (
    <div>
      <h1>Product ID: {id}</h1>
    </div>
  )
}

export default ProductsDetailsPage
