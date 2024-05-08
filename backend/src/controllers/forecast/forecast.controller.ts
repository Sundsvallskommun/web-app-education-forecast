import authMiddleware from '@/middlewares/auth.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import ApiService from '@/services/api.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, QueryParam, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { RequestWithUser } from '@/interfaces/auth.interface';
import ApiResponse from '@/interfaces/api-service.interface';
import { API_URL, API_PREFIX } from './config';
import { MyGroupsApiResponse, PupilsApiResponse, PupilApiResponse, MyMentorClassPupilsApiResponse } from '@/responses/forecast.response';
import { ForecastMyGroup, MyMentorClassPupil, Pupil } from '@/interfaces/forecast.interface';
import { copyPreviousForecastDto, setForecastDto } from '@/dtos/forecast.dto';

@Controller()
export class ForecastController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/mygroups`)
  @OpenAPI({ summary: 'Returns a teachers groups' })
  @UseBefore(authMiddleware)
  @ResponseSchema(MyGroupsApiResponse)
  async getMyGroups(
    @Req() req: RequestWithUser,
    @QueryParam('groupType') groupType: string,
    @QueryParam('period') period: string,
    @QueryParam('schoolYear') schoolYear: number,
  ): Promise<ApiResponse<ForecastMyGroup[]>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user; //CHANGE TO AS TEACHERID WHEN EMPLOYMENT IS FIXED
    const url = `${API_URL}/forecast`;

    return await this.apiService.get<ForecastMyGroup[]>({
      url,
      params: { teacherId: personId, period: period, schoolYear: schoolYear, groupType: groupType },
    });
  }

  @Get(`${API_PREFIX}/allpupils`)
  @OpenAPI({ summary: 'Returns all pupils' })
  @UseBefore(authMiddleware)
  @ResponseSchema(PupilsApiResponse)
  async getAllPupils(
    @QueryParam('period') period: string,
    @QueryParam('schoolYear') schoolYear: number,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<Pupil[]>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/forecast/pupils`;
    return await this.apiService.get<Pupil[]>({
      url,
      params: { teacherId: personId, period: period, schoolYear: schoolYear },
    });
  }

  @Get(`${API_PREFIX}/pupilsbygroup/:groupId`)
  @OpenAPI({ summary: 'Returns all pupils by group' })
  @UseBefore(authMiddleware)
  @ResponseSchema(PupilsApiResponse)
  async getPupilsByGroup(
    @Param('groupId') groupId: string,
    @QueryParam('period') period: string,
    @QueryParam('schoolYear') schoolYear: number,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<Pupil[]>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/forecast/group/${groupId}`;
    return await this.apiService.get<Pupil[]>({
      url,
      params: { teacherId: personId, period: period, schoolYear: schoolYear },
    });
  }

  @Get(`${API_PREFIX}/pupil/:pupilId`)
  @OpenAPI({ summary: 'Return specific pupil' })
  @UseBefore(authMiddleware)
  @ResponseSchema(PupilApiResponse)
  async getPupil(
    @Param('pupilId') pupilId: string,
    @QueryParam('period') period: string,
    @QueryParam('schoolYear') schoolYear: number,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<Pupil[]>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/forecast/pupil/${pupilId}`;
    return await this.apiService.get<Pupil[]>({
      url,
      params: { teacherId: personId, period: period, schoolYear: schoolYear },
    });
  }

  @Get(`${API_PREFIX}/mentorclass/:groupId`)
  @OpenAPI({ summary: 'Returns all pupils by group' })
  @UseBefore(authMiddleware)
  @ResponseSchema(MyMentorClassPupilsApiResponse)
  async getMyMentorClass(
    @Param('groupId') groupId: string,
    @QueryParam('period') period: string,
    @QueryParam('schoolYear') schoolYear: number,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<MyMentorClassPupil[]>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/forecast/class/${groupId}`;
    return await this.apiService.get<MyMentorClassPupil[]>({
      url,
      params: { teacherId: personId, period: period, schoolYear: schoolYear },
    });
  }

  @Post(`${API_PREFIX}/setforecast`)
  @OpenAPI({ summary: 'Set forecast grade on a pupil' })
  @UseBefore(authMiddleware, validationMiddleware(setForecastDto, 'body'))
  async setForecast(@Req() req: RequestWithUser, @Body() body: setForecastDto): Promise<ApiResponse<{}>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/forecast`;
    return await this.apiService.post({ url, data: { ...body, teacherId: personId } });
  }

  @Post(`${API_PREFIX}/copypreviousforecast`)
  @OpenAPI({ summary: 'Copy previous forecast and set to current' })
  @UseBefore(authMiddleware, validationMiddleware(copyPreviousForecastDto, 'body'))
  async copyPreviousForecast(@Req() req: RequestWithUser, @Body() body: copyPreviousForecastDto): Promise<ApiResponse<{}>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/forecast/copy`;
    return await this.apiService.post({ url, data: { ...body, teacherId: personId } });
  }

  @Delete(`${API_PREFIX}/cleargroupforecasts/:groupId`)
  @OpenAPI({ summary: 'Clear forecasts on pupils in a group, by year and period' })
  @HttpCode(200)
  @UseBefore(authMiddleware)
  async clearGroupForecasts(
    @Req() req: RequestWithUser,
    @Param('groupId') groupId: string,
    @QueryParam('period') period: string,
    @QueryParam('schoolYear') schoolYear: number,
  ): Promise<ApiResponse<{}>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/forecast/${groupId}`;
    return await this.apiService.delete({
      url,
      params: { teacherId: personId, period, schoolYear },
    });
  }
}
