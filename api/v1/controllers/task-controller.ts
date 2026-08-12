import e, {Request, Response} from 'express';
import Task from "../models/task.model";
import paginationHelper from '../../../helpers/pagination';
import searchHelper from '../../../helpers/search';

export const index = async (req: Request, res: Response) => {
  //find
  interface Find {
    deleted: boolean,
    status?: string,
    title?:RegExp
  }
  const find: Find = {
    deleted: false
  };

  if(req.query.status) {
    find.status = req.query.status.toString();
  }

  //sort 
  const sort = {};
  if(req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey.toString()] = req.query.sortValue;
  }

  // pagination
  let initPagination = {
    currentPage: 1,
    limitItem: 2,
  }
  const countTasks = await Task.countDocuments(find);
  const objectPagination = paginationHelper(
    initPagination,
    req.query,
    countTasks
  )
  // end pagination

  //search
  let objectSearch = searchHelper(req.query);

  if(req.query.keyword){
    find.title = objectSearch.regex;
  }
  //end search

  const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skip);
  res.json(tasks);
}

export const detail =  async (req: Request, res: Response) => {
  const id: string | string[] = req.params.id;

  const task = await Task.findOne({
    _id: id,
    deleted: false
  });
  res.json(task);
}

export const changeStatus = async (req: Request, res: Response) => {
try {
  const id: string | string[] = req.params.id;
  const status: string = req.body.status;

  await Task.updateOne({
    _id: id
  }, {
    status: status
  })

  res.json({
    code:200,
    message: " Câp nhật trạng thái thành công"
  })
} catch (error) {
  res.json({
      code: 400,
      message: "Cập nhật trạng thái thất bại"
  })
}
}

export const changeMulti = async (req: Request, res: Response) => {
  try {
    const ids: string[] = req.body.ids;
    const key: string = req.body.key;
    const value: string = req.body.value;

    switch (key) {
      case "status":
        await Task.updateMany({
          _id: {
            $in: ids
          }
        }, {
          status: value
        })
        break;
    
      default:
        break;
    }

    res.json({
      code: 200,
      message: "Cập nhật thành công"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật thất bại"
    })
  }
}

export const create = async (req: Request, res: Response) => {
  try {
    const product = new Task(req.body);
    const data = await product.save();

    res.json({
      code: 200,
      message: "Tạo mới thành công",
      data: data
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Tạo mới thất bại"
    })
  }
}

export const edit = async (req: Request, res: Response) => {
  try {
    const id: string | string[] = req.params.id;

    await Task.updateOne({
      _id: id
    }, req.body
  );
    res.json({
      code: 200,
      message: "Cập nhật thành công"
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật thất bại"
    })
  }
}