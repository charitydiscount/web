type FunctionType = (...args: any[]) => any;
interface IActionCreatorsMapObject  { [actionCreator: string]: FunctionType }

export type ActionTypesUnion<A extends IActionCreatorsMapObject> = ReturnType<A[keyof A]>