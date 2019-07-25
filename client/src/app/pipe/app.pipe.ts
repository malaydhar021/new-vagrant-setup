import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
@Pipe ({
    name : 'localDateTime'
})
export class DateTimePipe implements PipeTransform {
    transform(dateTime : string) : string {
        return moment.utc(dateTime).local().format('MMMM DD, LT');
    }
}