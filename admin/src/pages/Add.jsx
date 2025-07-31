import React, { useState } from "react";
import upload_icon from "../assets/upload_icon.png";
import { server_url } from "../App";
import { toast } from "react-toastify";
import axios from "axios";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [popular, setPopular] = useState(false);
  const [sizes, setSizes] = useState([
  
  { size: "S", quantity: 0 },
  { size: "M", quantity: 0 },
  { size: "L", quantity: 0 },
  { size: "XL", quantity: 0 },
  { size: "XXL", quantity: 0 },
]);

  const [colors, setColors] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("popular", popular);
      formData.append("sizes", JSON.stringify(sizes));
formData.append("colors", JSON.stringify(colors));


      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        server_url + "/api/product/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // if required
          },
        }
      );

      if(response.data.success){
          toast.success(response.data.message)
          setName("")
          setDescription("")
          setImage1(false)
          setImage2(false)
          setImage3(false)
          setImage4(false)
          setPrice("")
          setSizes([])
          setColors([])
        } else{
          toast.error(response.data.message)
        }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  };

  return (
    <div className="px-2 sm:px-8 mt-2 sm:mt-14 pb-16">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-y-3 medium-14 lg:w-[777px]"
      >
        <div className="w-full">
          <h5 className="h5">Product Name</h5>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Enter here.."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full sm:w-lg"
          />
        </div>

        <div className="w-full">
          <h5 className="h5">Product Description</h5>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            type="text"
            rows={5}
            placeholder="Enter here.."
            className="px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full sm:w-lg"
          />
        </div>

        <div>
          <div className="flex flex-col sm:flex-row gap-4 ">
            <div className="flex flex-row gap-4">
              <div>
                <h5 className="h5">Category</h5>
                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  className="max-w-28 px-3 py-2 text-gray-30 ring-1 ring-slate-900/5 bg-white rounded"
                >
                  <option value="">Select Category</option> 
                  <option value="Wholesale women">Wholesale Women</option>
                  <option value="Wholesale unisex">Wholesale Unisex</option>
                  <option value="Single Sale Women">Single Sale Women</option>
                  <option value="Single Sale Unisex">Single Sale Unisex</option>
                </select>
              </div>

              <div>
                <h5 className="h5">Sub Category</h5>
                <select
                  onChange={(e) => setSubCategory(e.target.value)}
                  value={subCategory}
                  className="max-w-20 px-3 py-2 text-gray-30 ring-1 ring-slate-900/5 bg-white rounded"
                >
                  <option value="">Select Sub Category</option> 
                  <option value="Bubu Gown">Bubu Gown</option>
                  <option value="2pcs wears">2pcs Wear</option>
                  <option value="Dresses">Dresses</option>
                </select>
              </div>
            </div>

            <div>
              <h5 className="h5">Product Price</h5>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="max-w-20 px-3 py-2 text-gray-30 ring-1 ring-slate-900/5 bg-white rounded"
                type="number"
                placeholder="100"
              />
            </div>
          </div>
        </div>

     <div>
  <h5 className="h5">Product Sizes & Quantities</h5>
  <div className="flex flex-wrap gap-4 mt-2">
    {["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"].map((label) => {
      const existing = sizes.find((s) => s.size === label);

      return (
        <div key={label} className="flex flex-col items-center gap-1">
          <span
            onClick={() => {
              if (existing) {
                setSizes((prev) => prev.filter((s) => s.size !== label));
              } else {
                setSizes((prev) => [...prev, { size: label, quantity: 0 }]);
              }
            }}
            className={`${
              existing ? "bg-teritary text-white" : "bg-white"
            } text-gray-50 rounded ring-1 ring-slate-900/5 px-3 py-1 cursor-pointer`}
          >
            {label}
          </span>

          {existing && (
            <input
              type="number"
              min={0}
              value={existing.quantity}
              onChange={(e) => {
                const qty = parseInt(e.target.value) || 0;
                setSizes((prev) =>
                  prev.map((s) =>
                    s.size === label ? { ...s, quantity: qty } : s
                  )
                );
              }}
              className="w-16 px-2 py-1 rounded border text-sm"
              placeholder="Qty"
            />
          )}
        </div>
      );
    })}
  </div>
</div>


        <div className="mt-6">
          <h5 className="h5">Product Colors</h5>
          <div className="flex gap-3 mt-2 flex-wrap">
            {[
              "#000000",
              "#ffffff",
              "#ff0000",
              "#00ff00",
              "#0000ff",
              "#f59e0b",
            ].map((color) => (
              <div
                key={color}
                onClick={() =>
                  setColors((prev) =>
                    prev.includes(color)
                      ? prev.filter((item) => item !== color)
                      : [...prev, color]
                  )
                }
                className={`w-8 h-8 rounded-full ring-2 cursor-pointer transition ${
                  colors.includes(color)
                    ? "ring-secondary scale-105"
                    : "ring-slate-300"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              ></div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <label htmlFor="image1">
            <img
              src={image1 ? URL.createObjectURL(image1) : upload_icon}
              alt=""
              className="cursor-pointer w-16 h-16 object-cover ring-1 ring-slate-900/5 rounded-lg"
            />
          </label>
          <input
            onChange={(e) => setImage1(e.target.files[0])}
            type="file"
            name="image1"
            id="image1"
            hidden
          />
          <label htmlFor="image2">
            <img
              src={image2 ? URL.createObjectURL(image2) : upload_icon}
              alt=""
              className="cursor-pointer w-16 h-16 object-cover ring-1 ring-slate-900/5 rounded-lg"
            />
          </label>
          <input
            onChange={(e) => setImage2(e.target.files[0])}
            type="file"
            name="image2"
            id="image2"
            hidden
          />
          <label htmlFor="image3">
            <img
              src={image3 ? URL.createObjectURL(image3) : upload_icon}
              alt=""
              className="cursor-pointer w-16 h-16 object-cover ring-1 ring-slate-900/5 rounded-lg"
            />
          </label>
          <input
            onChange={(e) => setImage3(e.target.files[0])}
            type="file"
            name="image3"
            id="image3"
            hidden
          />
          <label htmlFor="image4">
            <img
              src={image4 ? URL.createObjectURL(image4) : upload_icon}
              alt=""
              className="cursor-pointer w-16 h-16 object-cover ring-1 ring-slate-900/5 rounded-lg"
            />
          </label>
          <input
            onChange={(e) => setImage4(e.target.files[0])}
            type="file"
            name="image4"
            id="image4"
            hidden
          />
        </div>

        <div className="flexStart gap-2 my-2 ">
          <input
            onChange={(e) => setPopular((prev) => !prev)}
            type="checkbox"
            checked={popular}
            id="popular"
          />
          <label htmlFor="popular" className="cursor-pointer">
            Add to Popular
          </label>
        </div>

        <button type="submit" className="btn-dark mt-3 max-w-44 sm:w-full">
          Add Products
        </button>
      </form>
    </div>
  );
};

export default Add;
