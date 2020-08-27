import { HttpMethod, HttpClientHost, GetCurrRequest, ContentType } from './static';

const { QUERY_STRING } = ContentType;
const { POST, GET } = HttpMethod;

// 配置接口
export const API = {
  XXX: GetCurrRequest(GET, 'XXX', HttpClientHost[XXX]),
  XXX: GetCurrRequest(POST, 'XXX', HttpClientHost[XXX], QUERY_STRING),
}