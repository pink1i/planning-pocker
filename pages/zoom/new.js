import { useForm, Controller } from "react-hook-form"
import Input from "../../components/Input"
import { isEmpty } from "lodash"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import Head from "next/head"
import Router from "next/router"

const NewZoom = () => {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    watch,
    reset,
    register,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      password: "",
    },
    resolver: yupResolver(Yup.object().shape({
      name: Yup.string().required("The field is required")
    }))
  });

  const onSubmit = async (formdata) => {
    const res = await fetch("/api/zoom", { method: "POST", body: JSON.stringify(formdata), headers: { 'Content-Type': 'application/json'} });
    const { z, n } = await res.json();
    Router.push(`/zoom/${n}-${z}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <Head>
        <title>
          New Zoom | Basic version of planningpokeronline.com
        </title>
      </Head>
      <header>
        <h1 className="font-bold p-10 text-2xl text-slate-700">Create Zoom</h1>
      </header>
      <main className="flex p-20 justify-center items-center h-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-[500px]">
          <div className="mb-3">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Zoom Name"
                  value={value}
                  type="text"
                  error={!isEmpty(errors?.name)}
                  helperText={errors?.name && errors?.name?.message}
                  onChange={onChange}
                  placeholder="Zoom Name"
                />
              )}
            />
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  value={value}
                  type="password"
                  error={!isEmpty(errors?.password)}
                  helperText={errors?.password && errors?.password?.message}
                  onChange={onChange}
                  placeholder="Password Name (Optional)"
                />
              )}
            />
          </div>
          <div className="mb-3 ">
            <button
              type="submit"
              className="bg-blue-500 w-full text-white px-6 py-2 rounded font-medium hover:bg-blue-400 transition duration-200 each-in-out"
            >
              Create
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewZoom;
