// import { Handler } from "aws-lambda";
// import { getItemsFromDdb } from "./getItems";

// const getService: Handler = async (event: any) => {
//   let data: any;
//   try {
//     data = await getItemsFromDdb(event);
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.log(e);
//   }
//   if (!data) {
//     throw new Error("Data not defined");
//   }
//   let item;
//   if (data.Items.length > 1) {
//     item = data.Items.reduce((prev: any, current: any) =>
//       +prev.timeStamp > +current.timeStamp ? prev : current
//     );
//   } else {
//     [item] = data.Items;
//   }

//   return item;
// };

// export { getService };

export {};
