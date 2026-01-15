
const ClientFooter = () => {
  return (
    <footer
      className="bg-white dark:bg-slate-900 fixed bottom-0 left-0 z-20 w-full p-4  border-t border-gray-100 dark:border-slate-800 shadow md:flex md:items-center md:justify-between md:p-6 ">
      <div className="md:ml-60 lg:ml-60">
        <span className="text-brand-pl text-md  dark:text-slate-400"> Ⓒ All rights reserved by </span>
        {/* <a href="https://www.foodstorm.com/" target="_blank" className="text-blue-600">
          Transit
        </a> */}
      </div>
    </footer>
  );
};

export default ClientFooter;
