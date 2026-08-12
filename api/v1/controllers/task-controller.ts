import {Request, Response} from 'express';
import Task from "../models/task.model";
import paginationHelper from '../../../helpers/pagination';

export const index = async (req: Request, res: Response) => {
  //find
  interface Find {
    deleted: boolean;
    status?: string;
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