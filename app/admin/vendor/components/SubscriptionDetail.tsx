//import { ISubscription } from "@/modules/subscription";
import { AmountParserTag, BooleanParserTag } from "../../components/common/CommonTag";

// interface Props {
//     subscription?: ISubscription[]
// }
// const SubscriptionDetail = (props: Props) => {
//     if (!props.subscription) return <div></div>
//     return (<div className="flex md:flex-row flex-col ">
//         {
//             props.subscription.map((item) => {
//                 return (
//                     <div className="card bg-white mx-4 py-2 rounded-md w-full">
//                         <div className="card-title">Package Details</div>
//                         <div className="w-full justify-start content-start grid grid-cols-3 px-6 py-3 gap-4">
//                             <div className="flex flex-col gap-2">
//                                 <span className="text-gray-400 text-sm">Name</span>
//                                 <span className="text-brand-950 font-bold">{item?.planName}</span>
//                             </div>
//                             <div className="flex flex-col gap-2">
//                                 <span className="text-gray-400 text-sm">Amount</span>
//                                 <AmountParserTag amount={item.price} />
//                             </div>
//                             <div className="flex flex-col gap-2">
//                                 <span className="text-gray-400 text-sm">Categorize</span>
//                                 <BooleanParserTag value={item.categorize} />
//                             </div>
//                             <div className="flex flex-col gap-2">
//                                 <span className="text-gray-400 text-sm">Formula</span>
//                                 <BooleanParserTag value={item.formula} />
//                             </div>
//                             <div className="flex flex-col gap-2">
//                                 <span className="text-gray-400 text-sm">Page Limit</span>
//                                 <span className="text-brand-950 font-bold">{item.pageLimit}</span>
//                             </div>
//                         </div>
//                     </div>
//                 )
//             })
//         }
//     </div>)
//}

//export default SubscriptionDetail;