import { MUNICIPALITY_ID } from '@/config';
import { APIS } from '@/config/api-config';
import { HttpException } from '@/exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import ApiService from '@/services/api.service';
import { Controller, Get, Header, Param, QueryParam, Req, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';

@Controller()
export class EmployeeController {
  private readonly apiService = new ApiService();
  private readonly api = APIS.find(api => api.name === 'employee');

  @Get('/employee/:personId/personimage')
  @OpenAPI({ summary: 'Return employee image' })
  @UseBefore(authMiddleware)
  @Header('Content-Type', 'image/jpeg')
  @Header('Cross-Origin-Embedder-Policy', 'require-corp')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  async getEmployeeImage(@Param('personId') personId: string, @QueryParam('width') width): Promise<any> {
    const url = `${this.api.name}/${this.api.version}/${MUNICIPALITY_ID}/${personId}/personimage`;
    const res = await this.apiService.get<any>({
      url,
      responseType: 'arraybuffer',
      params: {
        width: width,
      },
    });
    return res.data;
  }

  @Get('/employee/personimage')
  @OpenAPI({ summary: 'Return logged in person image' })
  @UseBefore(authMiddleware)
  @Header('Content-Type', 'image/jpeg')
  @Header('Cross-Origin-Embedder-Policy', 'require-corp')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  async getMyEmployeeImage(@Req() req: RequestWithUser, @QueryParam('width') width): Promise<any> {
    const { personId } = req.user;

    if (!personId) {
      throw new HttpException(400, 'Bad Request');
    }

    const url = `${this.api.name}/${this.api.version}/${MUNICIPALITY_ID}/${personId}/personimage`;
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
