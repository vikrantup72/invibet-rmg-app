import { create } from 'apisauce';
import { AppConstant } from '../../constants/AppConstants';
const api = create({
  baseURL: AppConstant.baseurl,
  timeout: 20000,
});


const naviMonitor = response => {
  console.log('Api Response ==> ', JSON.stringify(response?.config?.url))

};
 api.addMonitor(naviMonitor);
export default api;
