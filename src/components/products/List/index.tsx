import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { ISearchProduct } from "../types";
import qs from 'qs';

const ProductsListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const { products, last_page } = useTypedSelector((store) => store.product);
  const { fetchProducts } = useActions();
  const [search, setSearch] = useState<ISearchProduct>({
    page: searchParams.get("page"),
    name: searchParams.get("name")
  });
  useEffect(() => {
    async function getProducts() {
        setLoading(true);
        try {
          await fetchProducts(search);
          setLoading(false);
        } catch (ex) {
          setLoading(false);
        }
      }
      getProducts();
  }, [search]);

  const buttons = [];
  for (var i = 1; i <= last_page; i++) {
    buttons.push(i);
  }

  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-light">
          <div className="d-flex">
            <button type="submit" className="btn btn-outline-primary">Add</button>&nbsp;
              <form className="d-flex">
              <input className="form-control me-sm-2" type="text" name="searchName" placeholder="Name"/>
              <input className="form-control me-sm-2" type="text" name="searchDetail" placeholder="Detail"/>
              
              <button type="submit" className="btn btn-outline-dark">Search</button>&nbsp;
              <button type="submit" className="btn btn-outline-dark">Reset</button>
              </form>
        </div>
      </nav>

      <h1 className="text-center">Товари на сайті</h1>
      {loading && <h2>Loading ...</h2>}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Details</th>
            <th scope="col" className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            return (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.name}</td>
                <td>{item.detail}</td>
                <td className="text-center">
                  <button type="button" className="btn btn-warning">Edit</button>&nbsp;
                  <button type="button" className="btn btn-danger">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr></tr>
        </tfoot>
      </table>
      <div className="text-center pagin">
        {buttons.map((item, key) => {

          const page : ISearchProduct = {
            ...search,
            page: item
          } 

          return (
            <Link
            onClick={()=>{setSearch(page);}}
              key={key}
              to={"?" + qs.stringify(page)}
              className="btn btn-success"
            >
              {item}
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default ProductsListPage;
