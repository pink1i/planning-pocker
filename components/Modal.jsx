const Modal = ({
  header,
  onConfirm,
  onClose,
  textSave,
  textClose,
  children,
  issubbmit=false,
  ConfirmComponent
}) => {
  return (
    <div className="bg-gray-600/[.8] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 md:h-full ">
      <div className="relative p-4 flex justify-center items-center h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 overflow-auto max-h-[800px] max-w-[800px] min-w-[600px]">
          <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {header}
            </h3>
            {textClose && (
              <button
                onClick={onClose}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="defaultModal"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            )}
          </div>
          <div className="p-6 space-y-6">{children}</div>
          <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            {ConfirmComponent || (
              <button
                disabled={issubbmit}
                onClick={onConfirm}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
                  disabled:bg-blue-300
                "
              >
                {textSave}
              </button>
            )}
            {textClose && (
              <button
                onClick={onClose}
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                {textClose}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
