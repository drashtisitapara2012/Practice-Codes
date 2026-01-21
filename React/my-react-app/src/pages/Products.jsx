import { Link, useSearchParams } from "react-router-dom";

function Products() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  return (
    <>
      <h2>Products Page</h2>
      <p>Category: {category}</p>

      <Link to="/products/1">Product 1</Link><br />
      <Link to="/products/2">Product 2</Link><br />

      <Link to="/products?category=mobile">Filter Mobile</Link>
    </>
  );
}

export default Products;
