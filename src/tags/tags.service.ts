

import TagModel from "./../db/models/TagModel"
import RecentQuery from "./../db/models/RecentQuery"

async function createTag(tag_content: string, query_id: string) {
    const tag = new TagModel({tag_content: tag_content, query_id: query_id})
    const savedTag = await tag.save();
    const query = await RecentQuery.findOne({_id: query_id});
    if(query && query.tags) {
        query.tags.push(savedTag._id);
        await query.save();
    } else {
        throw new Error("queryId not found");
    }

     return savedTag
}

async function queryExists(queryId: string){
    const query = await RecentQuery.findOne({_id: queryId});
 
    if(query) {
      return true;
    }
    throw new Error("queryId not found")
}

async function tagExists(tagId: string){
    const tag = await TagModel.findOne({_id: tagId});
    if(tag) {
      return true;
    }   
    throw new Error("tagId not found")
}

async function update(tag_id: string, tag_content: string) {
    const tag = await TagModel.findOne({_id: tag_id});
    if(tag) {
        tag.tag_content = tag_content;
        return await tag.save();
    }
}

async function deleteTag(tag_id: string) {
    const tag = await TagModel.findOne({_id: tag_id});
    if(tag) {
        await TagModel.deleteOne({_id: tag_id});
    }
}



export default {
    createTag,
    queryExists,
    tagExists,
    update,
    delete: deleteTag
}