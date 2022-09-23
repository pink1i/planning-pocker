import io from "socket.io-client";
import className from "classnames";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import { isEmpty } from "lodash";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
let socket;

const split2Part = (a, n, balanced = true) => {
  if (n < 2) return [a];

  var len = a.length,
    out = [],
    i = 0,
    size;

  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, (i += size)));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, (i += size)));
    }
  } else {
    n--;
    size = Math.floor(len / n);
    if (len % size === 0) size--;
    while (i < size * n) {
      out.push(a.slice(i, (i += size)));
    }
    out.push(a.slice(size * n));
  }

  return out;
};

const CardItem = ({
  user,
  myProfile,
  isShow,
  setIsShowModalChangeUserName,
}) => {
  return (
    <div className="w-20 flex items-center justify-center flex-col perspective">
      <div
        className={classNames(
          "bg-gray-200 h-20 w-12 rounded-xl flex relative CardHoder",
          {
            CardFliped: isShow,
            "bg-white border-blue-500 border-2": user.selected,
          }
        )}
      >
        {user?.selected && (
          <div className="PictureBox CardFront CardItem "></div>
        )}
        {user?.selected && (
          <div className="CardValue back--card CardItem font-bold">
            {user?.card}
          </div>
        )}
      </div>
      {myProfile.id == user.userId ? (
        <div
          className={classNames(
            "font-bold text-lg mt-2 text-blue-500 text-center cursor-pointer"
          )}
          onClick={() => setIsShowModalChangeUserName(true)}
        >
          {user?.name}
        </div>
      ) : (
        <div className={classNames("font-bold text-lg mt-2 text-center")}>
          {user?.name}
        </div>
      )}
    </div>
  );
};

const Zoom = ({ zoomId, zoomName, needPass }) => {
  const [myProfile, setmyProfile] = useState({});
  const [isShowModalChangeUserName, setIsShowModalChangeUserName] =
    useState(false);
  const [authErr, setAuthErr] = useState(null);
  const [isShowModalPwd, setIsShowModalPwd] = useState(false);
  const [islatmat, setIsLatMat] = useState(false);
  const [voteData, setVoteData] = useState([]);
  const [posUsers, setPosUser] = useState({
    top: [],
    right: [],
    left: [],
    bottom: [],
  });
  const [isShow, setIsShow] = useState(false);
  const [luachon, chonLua] = useState(null);
  const [input, setInput] = useState("");
  const [inputChat, setInputChat] = useState("");
  const [messages, setMessages] = useState([]);
  console.log(voteData);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
    },
    resolver: yupResolver(
      Yup.object().shape({
        password: Yup.string().required("The field is required"),
      })
    ),
  });

  useEffect(() => {
    socketInitializer().then(() => {
      if (needPass) {
        setIsShowModalPwd(true);
      } else {
        joinZoom();
      }
    });
  }, []);

  useEffect(() => {
    if (isEmpty(myProfile)) return;
    localStorage.setItem("user", JSON.stringify(myProfile));
  }, [myProfile]);

  const joinZoom = () => {
    let user = JSON.parse(localStorage.getItem("user"));

    if (!isEmpty(user)) {
      setmyProfile(user);
      setInput(user.name);
      socket.emit("join", zoomId, user);
    } else {
      setIsShowModalChangeUserName(true);
    }
  };

  const socketInitializer = async () => {
    await fetch("/api/socket");

    socket = io();

    socket.on("notify", (users) => {
      setPosition(users);
    });

    socket.on("tatcalatmat", (users) => {
      setIsShow(true);
      setIsLatMat(true);
    });

    socket.on("tatcaupmat", (users) => {
      setIsShow(false);
      setPosition(users);
      setIsLatMat(false);
      chonLua(null);
    });

    socket.on("update-chat", (message) => {
      setMessages((currentMess) => [...currentMess, message]);
    });

    socket.on("connect", () => {
      console.log("Init connection ID: " + socket.id);
    });
  };

  const selectCard = (v) => {
    if (islatmat) return;
    chonLua(v);
    socket.emit("chonbai", zoomId, myProfile.id, v);
  };

  const latmat = () => {
    socket.emit("thongbaolatmat", zoomId);
    setIsLatMat(true);
  };

  const upmat = () => {
    socket.emit("thongbaoupmat", zoomId);
    setIsLatMat(false);
  };

  const setPosition = (users) => {
    setVoteData(users);
    const tmp = split2Part(users, 4);
    setPosUser({
      top: tmp[0] || [],
      right: tmp[1] || [],
      left: tmp[2] || [],
      bottom: tmp[3] || [],
    });
  };

  const submit = () => {
    if (isEmpty(myProfile)) {
      const user = {
        id: uuidv4(),
        name: input,
      };
      localStorage.setItem("user", JSON.stringify(user));
      setmyProfile(user);
      setInput(input);
      socket.emit("join", zoomId, user);
      setIsShowModalChangeUserName(false);
    } else {
      socket.emit("update-user", input, myProfile.id, zoomId);
      setIsShowModalChangeUserName(false);
      setmyProfile({ ...myProfile, name: input });
    }
  };

  const sendChat = (e) => {
    if (e.key === "Enter") {
      socket.emit("send-message", zoomId, inputChat, myProfile.name);
      setInputChat("");
    }
  };

  const onSubmitPwd = async (formData) => {
    const res = await fetch("/api/zoom/" + zoomId, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    const { isAuthen } = await res.json();
    if (isAuthen) {
      joinZoom();
      setAuthErr(null);
      setIsShowModalPwd(false);
    } else setAuthErr("Password Incorrect");
  };

  const renderStatic = () => {
    console.log(voteData);
    const data = voteData.reduce(function (obj, v) {
      obj[v.card] = {
        total: (obj[v.card]?.total || 0) + 1,
        percent: (((obj[v.card]?.total || 0) + 1) * 100) / voteData.length,
      };
      return obj;
    }, {});
    console.log(data);

    return (
      <div className="flex">
        <div className="flex">
          {Object.keys(data).map((key, idx) => (
            <div className="flex flex-col items-center mx-4" key={idx}>
              <div className="w-3 h-20 relative rounded-lg bg-slate-200 flex mb-2 items-end">
                {console.log(data[key].percent)}
                <div
                  className={className("w-3 bg-slate-700 rounded-lg")}
                  style={{ height: `${data[key].percent}%` }}
                ></div>
              </div>
              <div
                key={idx}
                className={classNames(
                  "text-slate-700 w-16 h-20 text-xl text-center mx-2 rounded-lg flex items-center justify-center font-bold  border-slate-700 border-4"
                )}
              >
                {key == "null" ? (
                  <span className="text-sm">No voted</span>
                ) : (
                  key
                )}
              </div>
              <span className="text-lg">{data[key].total} Votes</span>
            </div>
          ))}
        </div>
        {/* <div>
          <div className="text-xl">Average:</div>
          <div className="text-3xl font-bold text-center">{}</div>
        </div> */}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 h-screen flex justify-center items-center">
      <div>
        <h1 className="text-xl">Zoom of <span className="font-bold">{zoomName}</span></h1>
        <div className="pk-area grid grid-rows-3 grid-cols-3 gap-5">
          <div className="flex items-center justify-center min-h-[150px] min-w-[250px]"></div>
          <div className="flex items-center justify-center min-h-[150px] min-w-[250px]">
            {posUsers.top.map((user, idx) => (
              <CardItem
                key={idx}
                user={user}
                isShow={isShow}
                myProfile={myProfile}
                setIsShowModalChangeUserName={setIsShowModalChangeUserName}
              />
            ))}
          </div>
          <div className="flex items-center justify-center min-h-[150px] min-w-[250px]"></div>
          <div className="flex items-center justify-center min-h-[150px] min-w-[250px]">
            {posUsers.right.map((user, idx) => (
              <CardItem
                key={idx}
                user={user}
                isShow={isShow}
                myProfile={myProfile}
                setIsShowModalChangeUserName={setIsShowModalChangeUserName}
              />
            ))}
          </div>
          <div className="bg-blue-100 rounded-2xl px-8 py-6 flex items-center justify-center min-h-[150px] min-w-[250px]">
            <button
              type="button"
              onClick={islatmat ? upmat : latmat}
              className="bg-blue-500 text-white px-3 py-2 h-10 rounded-md font-medium mx-3 hover:bg-blue-600 transition duration-200 each-in-out"
            >
              {islatmat ? "Úp Mặt" : "Lật Mặt"}
            </button>
          </div>
          <div className="flex items-center justify-center min-h-[150px] min-w-[250px]">
            {posUsers.bottom.map((user, idx) => (
              <CardItem
                key={idx}
                user={user}
                isShow={isShow}
                myProfile={myProfile}
                setIsShowModalChangeUserName={setIsShowModalChangeUserName}
              />
            ))}
          </div>
          <div className="flex items-center justify-center min-h-[150px] min-w-[250px]"></div>
          <div className="flex items-center justify-center min-h-[150px] min-w-[250px]">
            {posUsers.left.map((user, idx) => (
              <CardItem
                key={idx}
                user={user}
                isShow={isShow}
                myProfile={myProfile}
                setIsShowModalChangeUserName={setIsShowModalChangeUserName}
              />
            ))}
          </div>
          <div className="flex items-center justify-center min-h-[150px] min-w-[250px]"></div>
        </div>
        <div className="transition duration-200 each-in-out h-44">
          <p className="mb-5 text-center">
            Choose your card for{" "}
            <span className="font-bold">Player {myProfile?.name}</span>
          </p>
          {islatmat && (
            <div className="flex justify-center">{renderStatic()}</div>
          )}
          {!islatmat && (
            <div className="flex justify-center">
              {["0", "1/2", "1", "2", "3", "5", "8", "13", "21", "34", "?"].map(
                (i, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectCard(i)}
                    className={classNames(
                      "w-14 h-20  mx-2 rounded-md flex items-center justify-center font-bold  border-blue-500 border-2 cursor-pointer ease-linear duration-200",
                      {
                        "bg-blue-500 text-white -mt-2": luachon == i,
                        "text-blue-500 bg-white hover:bg-blue-200":
                          luachon !== i,
                        "cursor-not-allowed": islatmat,
                      }
                    )}
                  >
                    {i}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <div className="border rounded p-3 h-5/6 w-80 flex flex-col justify-between">
        <div className="border p-3 h-full bg-white overflow-auto">
          {messages.map((mes, idx) => (
            <p
              key={idx}
              className={className("text-sm", {
                "italic bg-red-100 p-1 rounded mb-1": mes.src == "system",
              })}
            >
              {mes.owener && (
                <span className="font-bold">
                  {mes.owener}
                  {mes.src != "system" && ":"}
                </span>
              )}{" "}
              {mes.message}
            </p>
          ))}
        </div>
        <Input
          placeholder="Enter your name"
          value={inputChat}
          onChange={(e) => setInputChat(e.target.value)}
          onKeyPress={sendChat}
        />
      </div>
      {isShowModalChangeUserName && (
        <Modal
          onClose={() => setIsShowModalChangeUserName(false)}
          onConfirm={submit}
          textClose="Close"
          textSave="OK"
          header="Enter your name"
        >
          <Input
            label="Your Name"
            placeholder="Enter your name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Modal>
      )}
      {isShowModalPwd && (
        <Modal
          onConfirm={handleSubmit(onSubmitPwd)}
          textSave="OK"
          header="Enter password"
        >
          <form onSubmit={(e) => e.preventDefault()}>
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
          </form>
          {authErr && <p className="text-red-500 text-sm">{authErr}</p>}
        </Modal>
      )}
    </div>
  );
};

export default Zoom;

export async function getServerSideProps({ query }) {
  const { id } = query;

  const res = await fetch(
    `${process.env.SERVER || "http://localhost:3000"}/api/zoom/${id}`
  );
  console.log(res.status)
  if (res.status == 200 ) {
    const { zoomName, needPass } = await res.json();
    return {
      props: {
        zoomId: id,
        zoomName,
        needPass,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/401',
        permanent: false
      }
    }
  }


}
