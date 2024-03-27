

import TagModel from "./../db/models/TagModel"

async function createTag(tag_content: string, query_id: string) {
    const tag = new TagModel({tag_content: tag_content, query_id: query_id})
     return await tag.save()
}

export default {
    createTag,
}