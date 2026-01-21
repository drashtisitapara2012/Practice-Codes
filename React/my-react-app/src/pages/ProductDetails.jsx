import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  return <h2>Product Details for ID: {id}</h2>;
}

export default ProductDetails;
