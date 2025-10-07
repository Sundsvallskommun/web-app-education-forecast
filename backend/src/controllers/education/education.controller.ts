import { MUNICIPALITY_ID } from '@/config';
import { APIS } from '@/config/api-config';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Controller, Get, Header, Param, QueryParam, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

@Controller()
export class EducationController {
  private apiService = new ApiService();
  private api = APIS.find(api => api.name === 'education');

  @Get('/education/:pupilId/personimage')
  @OpenAPI({ summary: 'Return pupil image' })
  @UseBefore(authMiddleware)
  @Header('Content-Type', 'image/jpeg')
  @Header('Cross-Origin-Embedder-Policy', 'require-corp')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  async getEmployeeImage(@Param('pupilId') pupilId: string, @QueryParam('width') width): Promise<any> {
    const url = `${this.api.name}/${this.api.version}/${MUNICIPALITY_ID}/${pupilId}/personimage`;
    const res = await this.apiService.get<any>({
      url,
      responseType: 'arraybuffer',
      params: {
        width: width,
      },
    });
    return res.data;
  }
}
