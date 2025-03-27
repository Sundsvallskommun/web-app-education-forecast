import authMiddleware from '@/middlewares/auth.middleware';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import ApiService from '@/services/api.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, QueryParam, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { RequestWithUser } from '@/interfaces/auth.interface';
import ApiResponse from '@/interfaces/api-service.interface';
import { API_URL, API_PREFIX } from './config';
import {
  PupilsApiResponse,
  PupilApiResponse,
  MentorClassPupilGridApiResponse,
  Period,
  PeriodApiResponse,
  PeriodsApiResponse,
  ForecastMetaGroupsApiResponse,
} from '@/responses/forecast.response';
import { ForecastMetaGroups, MyMentorClassPupilGrid, Pupil } from '@/interfaces/forecast.interface';
import { copyPreviousForecastDto, setForecastDto } from '@/dtos/forecast.dto';

const municipalityId: string = '2281';

@Controller()
export class PupilForecastController {
  private apiService = new ApiService();

  @Get(`${API_PREFIX}/currentperiod/:schoolType`)
  @OpenAPI({ summary: 'Returns current period based on school type' })
  @UseBefore(authMiddleware)
  @ResponseSchema(PeriodApiResponse)
  async getCurrentPeriod(@Param('schoolType') schoolType: string): Promise<ApiResponse<Period>> {
    const url = `${API_URL}/${municipalityId}/forecast/${schoolType}/period`;

    return await this.apiService.get<Period>({
      url,
    });
  }

  @Get(`${API_PREFIX}/allperiods/:schoolType`)
  @OpenAPI({ summary: 'Returns allperiods based on school type' })
  @UseBefore(authMiddleware)
  @ResponseSchema(PeriodsApiResponse)
  async getPeriods(@Param('schoolType') schoolType: string): Promise<ApiResponse<Period[]>> {
    const url = `${API_URL}/${municipalityId}/forecast/${schoolType}/periods`;

    return await this.apiService.get<Period[]>({
      url,
    });
  }

  @Get(`${API_PREFIX}/mygroups/:schoolId`)
  @OpenAPI({ summary: 'Returns a teachers groups' })
  @UseBefore(authMiddleware)
  @ResponseSchema(ForecastMetaGroupsApiResponse)
  async getMyGroups(
    @Req() req: RequestWithUser,
    @Param('schoolId') schoolId: string,
    @QueryParam('OrderBy') OrderBy: string,
    @QueryParam('OrderDirection') OrderDirection: string,
    @QueryParam('groupType') groupType: string,
    @QueryParam('periodId') periodId?: number | null,
    @QueryParam('searchFilter') searchFilter?: string | null,
    @QueryParam('PageNumber') PageNumber?: number | null,
    @QueryParam('PageSize') PageSize?: number | null,
  ): Promise<ApiResponse<ForecastMetaGroups>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user; //CHANGE TO AS TEACHERID WHEN EMPLOYMENT IS FIXED
    const url = `${API_URL}/${municipalityId}/forecast/${schoolId}`;

    return await this.apiService.get<ForecastMetaGroups>({
      url,
      params: {
        OrderBy,
        OrderDirection,
        periodId: periodId,
        groupType: groupType,
        searchFilter: searchFilter,
        PageNumber: PageNumber,
        PageSize: PageSize,
        teacherId: personId,
      },
    });
  }

  @Get(`${API_PREFIX}/:schoolId/allpupils`)
  @OpenAPI({ summary: 'Returns all pupils' })
  @UseBefore(authMiddleware)
  @ResponseSchema(PupilsApiResponse)
  async getAllPupils(
    @Param('schoolId') schoolId: string,
    @QueryParam('periodId') periodId: number,
    @QueryParam('searchFilter') searchFilter: string,
    @QueryParam('PageNumber') PageNumber: number,
    @QueryParam('PageSize') PageSize: number,
    @QueryParam('OrderBy') OrderBy: string,
    @QueryParam('OrderDirection') OrderDirection: string,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<Pupil[]>> {
    const { personId } = req.user;
    const url = `${API_URL}/${municipalityId}/forecast/${schoolId}/pupils`;
    return await this.apiService.get<Pupil[]>({
      url,
      params: {
        teacherId: personId,
        periodId: periodId,
        searchFilter: searchFilter,
        PageNumber: PageNumber,
        PageSize: PageSize,
        OrderBy: OrderBy,
        OrderDirection: OrderDirection,
      },
    });
  }

  @Get(`${API_PREFIX}/pupilsbygroup/:groupId/:syllabusId`)
  @OpenAPI({ summary: 'Returns all pupils by group' })
  @UseBefore(authMiddleware)
  @ResponseSchema(PupilsApiResponse)
  async getPupilsByGroup(
    @Param('groupId') groupId: string,
    @Param('syllabusId') syllabusId: string,
    @QueryParam('periodId') periodId: number,

    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<Pupil[]>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/${municipalityId}/forecast/group/${groupId}/${syllabusId}`;
    return await this.apiService.get<Pupil[]>({
      url,
      params: { teacherId: personId, periodId: periodId },
    });
  }

  @Get(`${API_PREFIX}/:schoolId/pupil/:pupilId`)
  @OpenAPI({ summary: 'Return specific pupil' })
  @UseBefore(authMiddleware)
  @ResponseSchema(PupilApiResponse)
  async getPupil(
    @Param('schoolId') schoolId: string,
    @Param('pupilId') pupilId: string,
    @QueryParam('periodId') periodId: number,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<Pupil[]>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/${municipalityId}/forecast/${schoolId}/pupil/${pupilId}`;
    return await this.apiService.get<Pupil[]>({
      url,
      params: { teacherId: personId, periodId: periodId },
    });
  }

  @Get(`${API_PREFIX}/mentorclass/:groupId/grid`)
  @OpenAPI({ summary: 'Returns all pupils by group' })
  @UseBefore(authMiddleware)
  @ResponseSchema(MentorClassPupilGridApiResponse)
  async getMyMentorClassGrid(
    @Param('groupId') groupId: string,
    @QueryParam('periodId') periodId: number,
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<MyMentorClassPupilGrid[]>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/${municipalityId}/forecast/class/${groupId}/grid`;
    return await this.apiService.get<MyMentorClassPupilGrid[]>({
      url,
      params: { teacherId: personId, periodId: periodId },
    });
  }

  @Post(`${API_PREFIX}/setforecast`)
  @OpenAPI({ summary: 'Set forecast grade on a pupil' })
  @UseBefore(authMiddleware, validationMiddleware(setForecastDto, 'body'))
  async setForecast(@Req() req: RequestWithUser, @Body() body: setForecastDto): Promise<ApiResponse<{}>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/${municipalityId}/forecast`;
    return await this.apiService.post({ url, data: { ...body, teacherId: personId } });
  }

  @Post(`${API_PREFIX}/copypreviousforecast`)
  @OpenAPI({ summary: 'Copy previous forecast and set to current' })
  @UseBefore(authMiddleware, validationMiddleware(copyPreviousForecastDto, 'body'))
  async copyPreviousForecast(@Req() req: RequestWithUser, @Body() body: copyPreviousForecastDto): Promise<ApiResponse<{}>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/${municipalityId}/forecast/copy`;
    return await this.apiService.post({ url, data: { ...body, teacherId: personId } });
  }

  @Delete(`${API_PREFIX}/cleargroupforecasts/:groupId/:syllabusId`)
  @OpenAPI({ summary: 'Clear forecasts on pupils in a group on current period' })
  @HttpCode(200)
  @UseBefore(authMiddleware)
  async clearGroupForecasts(
    @Req() req: RequestWithUser,
    @Param('groupId') groupId: string,
    @Param('syllabusId') syllabusId: string,
  ): Promise<ApiResponse<{}>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { personId } = req.user;
    const url = `${API_URL}/${municipalityId}/forecast/${groupId}/${syllabusId}`;
    return await this.apiService.delete({
      url,
      params: { teacherId: personId },
    });
  }
}
