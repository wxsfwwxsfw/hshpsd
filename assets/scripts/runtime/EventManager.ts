// Created by carolsail

import Singleton from "../Singleton"


interface IEventItem {
    event: Function
    context: unknown
}

class EventManager extends Singleton{
    eventMap: Map<String, Array<IEventItem>> = new Map()

    static get instance() {
        return super.getInstance<EventManager>()
    }

    on(name: string, event: Function, context?: unknown){
        if(this.eventMap.has(name)){
            const eventArr = this.eventMap.get(name)
            eventArr.push({event, context})
        }else{
            this.eventMap.set(name, [{event, context}])
        }
    }

    off(name: string, event: Function){
        if(this.eventMap.has(name)){
            const eventArr = this.eventMap.get(name)
            const index = eventArr.findIndex(item => item.event == event)
            if(index > -1) eventArr.splice(index, 1)
        }
    }

    emit(name: string, ...params: unknown[]){
        if(this.eventMap.has(name)){
            const eventArr = this.eventMap.get(name)
            eventArr.forEach(({event, context}) => {
                context ? event.apply(context, params) : event(params)
            })
        }
    }

    clear(){
        this.eventMap.clear()
    }
}

export default EventManager